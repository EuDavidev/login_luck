import countries from 'i18n-iso-countries';
import pt from 'i18n-iso-countries/langs/pt.json';
countries.registerLocale(pt);
export const countryOptions = Object.entries(
  countries.getNames('pt', {
    select: 'official',
  }),
)
  .map(([code, name]) => ({
    code,
    name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
