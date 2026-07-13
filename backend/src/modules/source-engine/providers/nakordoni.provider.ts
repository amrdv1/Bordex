import { Logger } from '@nestjs/common';
import axios from 'axios';
import { SourceProvider, QueueMetrics } from './provider.interface';

// Mapping from DB border point names to Nakordoni API PPIDs
const NAKORDONI_MAPPING: Record<string, string[]> = {
  'Ужгород': ['id_24', 'id_25', 'id_350', 'id_622'],
  'Малий Березний': ['id_22', 'id_23', 'id_60'],
  'Чоп (Тиса)': ['id_27', 'id_28', 'id_266'],
  'Дзвінкове': ['id_29', 'id_30'],
  'Косино': ['id_31', 'id_32'],
  'Лужанка': ['id_33', 'id_34', 'id_225', 'id_178', 'id_179'],
  'Вилок': ['id_35', 'id_36'],
  'Дякове': ['id_37', 'id_251', 'id_353'],
  'Порубне': ['id_40', 'id_41', 'id_42', 'id_351'],
  'Красноїльськ': ['id_43', 'id_44', 'id_157'],
  'Мамалига': ['id_47', 'id_48', 'id_49', 'id_360'],
  'Кельменці': ['id_50', 'id_51', 'id_52'],
  'Росошани': ['id_53', 'id_54', 'id_55'],
  'Сокиряни': ['id_56', 'id_57', 'id_58'],
  'Паланка': ['id_268', 'id_412'],
  'Маяки-Удобне': ['id_269', 'id_413'],
  'Старокозаче': ['id_283', 'id_414'],
  'Рені': ['id_187', 'id_359'],
  'Орлівка': ['id_230', 'id_436'],
  'Виноградівка': [], // No mapping found, will skip
  'Табаки': ['id_184'],
  'Серпневе 1': ['id_684'], // Serpneve 1 - Basarabeasca
  'Кучурган': [],
  'Платонове': [],
  'Могилів-Подільський': ['id_165', 'id_227', 'id_355'],
  'Бронниця': ['id_232', 'id_234']
};

export class NakordoniProvider implements SourceProvider {
  name = 'Nakordoni API';
  private readonly apiKey = 'NKD-DEV-KA7T-54NN-5PBE';
  private readonly logger = new Logger(NakordoniProvider.name);

  async fetchData(pointName: string): Promise<Partial<QueueMetrics> | null> {
    const ppids = NAKORDONI_MAPPING[pointName];
    if (!ppids || ppids.length === 0) {
      return null;
    }

    try {
      const response = await axios.get(`https://nakordoni.eu/api/v1/data/multi`, {
        params: { ppids: ppids.join(',') },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.data || !response.data.ok || !response.data.data) {
        return null;
      }

      let totalCars = 0;
      let totalTrucks = 0;
      let totalBuses = 0;
      let maxWaitTime = 0;
      let foundData = false;

      for (const ppid of ppids) {
        const pointData = response.data.data[ppid];
        if (pointData && pointData.queue && pointData.queue.found) {
          foundData = true;
          const queueNow = pointData.queue.queue_now || 0;
          totalCars += queueNow;
          
          if (pointData.queue.wait_min && pointData.queue.wait_min > maxWaitTime) {
            maxWaitTime = pointData.queue.wait_min;
          }
        }
      }

      if (!foundData) {
        return null;
      }

      return {
        cars: totalCars,
        trucks: totalTrucks,
        buses: totalBuses,
        waitTimeMins: maxWaitTime,
        confidenceScore: 0.9 // High confidence for actual API
      };
    } catch (error: any) {
      this.logger.error(`Failed to fetch Nakordoni data for ${pointName}: ${error.message}`);
      return null;
    }
  }
}
