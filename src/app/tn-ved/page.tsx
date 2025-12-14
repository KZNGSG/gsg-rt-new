import { Metadata } from 'next';
import { TNVEDWizard } from '@/components/tn-ved/TNVEDWizard';

export const metadata: Metadata = {
  title: 'Какие документы нужны на ваш товар? | ГостСертГрупп',
  description: 'Бесплатный онлайн-помощник: узнайте за 2 минуты, какие сертификаты и декларации нужны для вашего товара. 16 000+ кодов ТН ВЭД.',
  keywords: 'ТН ВЭД, сертификация, декларация, какие документы нужны, проверить товар',
};

export default function TNVEDPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TNVEDWizard />
    </main>
  );
}
