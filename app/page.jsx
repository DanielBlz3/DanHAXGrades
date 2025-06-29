// app/page.jsx
import HomePageClient from './HomePageClient';
import { translationsMap } from '/lib/translations.js';
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
export async function generateMetadata({ params }) {
  return {
    title: `DanHAXGrades - ${translationsMap?.["theBestHaxballX11App"]?.[storedLang]}`,
    description: `${translationsMap?.["danhaxgradesPara1"]?.[storedLang]}`
  };
}

export default async function Home({ params }) {
  return <HomePageClient />;
}

