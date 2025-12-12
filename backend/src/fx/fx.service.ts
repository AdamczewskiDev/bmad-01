import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { FXRate, Currency } from '../entities';
import Decimal from 'decimal.js';

type DecimalType = InstanceType<typeof Decimal>;

@Injectable()
export class FxService {
  constructor(
    @InjectRepository(FXRate)
    private fxRateRepository: Repository<FXRate>,
  ) {}

  async convertToBase(
    amount: DecimalType,
    fromCurrency: Currency,
    toCurrency: Currency,
    date: Date,
  ): Promise<DecimalType> {
    if (fromCurrency === toCurrency) return amount;

    const rate = await this.getRate(fromCurrency, toCurrency, date);
    return amount.times(rate);
  }

  async getRate(fromCurrency: Currency, toCurrency: Currency, date: Date): Promise<DecimalType> {
    if (fromCurrency === toCurrency) return new Decimal(1);

    const fromRate = await this.getRateForCurrency(fromCurrency, date);
    const toRate = await this.getRateForCurrency(toCurrency, date);

    if (fromCurrency === Currency.PLN) {
      return new Decimal(1).div(toRate);
    }
    if (toCurrency === Currency.PLN) {
      return fromRate;
    }

    return fromRate.div(toRate);
  }

  async getRateForCurrency(currency: Currency, date: Date): Promise<DecimalType> {
    if (currency === Currency.PLN) return new Decimal(1);

    let rate = await this.fxRateRepository.findOne({
      where: {
        currency,
        asOfDate: LessThanOrEqual(date),
      },
      order: { asOfDate: 'DESC' },
    });

    if (!rate) {
      rate = await this.fxRateRepository.findOne({
        where: { currency },
        order: { asOfDate: 'DESC' },
      });
    }

    if (!rate) {
      const dateStr = date.toISOString().split('T')[0];
      throw new Error(`No FX rate found for ${currency} on or before ${dateStr}`);
    }

    return new Decimal(rate.rate);
  }

  async fetchNbpRates() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/tables/A/${dateStr}?format=json`,
      );
      if (!response.ok) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const retryResponse = await fetch(
          `https://api.nbp.pl/api/exchangerates/tables/A/${yesterdayStr}?format=json`,
        );
        if (!retryResponse.ok) {
          throw new Error('NBP API unavailable');
        }
        const data = await retryResponse.json();
        return this.saveRates(data[0], yesterday);
      }

      const data = await response.json();
      return this.saveRates(data[0], today);
    } catch (error) {
      console.error('Error fetching NBP rates:', error);
      throw error;
    }
  }

  private async saveRates(nbpData: any, date: Date) {
    const rates = nbpData.rates || [];
    const eurRate = rates.find((r: any) => r.code === 'EUR');
    const usdRate = rates.find((r: any) => r.code === 'USD');

    const saved: any[] = [];
    if (eurRate) {
      let rate = await this.fxRateRepository.findOne({
        where: {
          asOfDate: date,
          currency: Currency.EUR,
        },
      });

      if (rate) {
        rate.rate = new Decimal(eurRate.mid).toNumber();
        rate = await this.fxRateRepository.save(rate);
      } else {
        rate = await this.fxRateRepository.save({
          asOfDate: date,
          currency: Currency.EUR,
          rate: new Decimal(eurRate.mid).toNumber(),
        });
      }
      saved.push(rate);
    }

    if (usdRate) {
      let rate = await this.fxRateRepository.findOne({
        where: {
          asOfDate: date,
          currency: Currency.USD,
        },
      });

      if (rate) {
        rate.rate = new Decimal(usdRate.mid).toNumber();
        rate = await this.fxRateRepository.save(rate);
      } else {
        rate = await this.fxRateRepository.save({
          asOfDate: date,
          currency: Currency.USD,
          rate: new Decimal(usdRate.mid).toNumber(),
        });
      }
      saved.push(rate);
    }

    return saved;
  }
}
