import '@fontsource-variable/fredoka';
import '@fontsource-variable/nunito';
import './globals.css';
export const metadata = {
  title: 'Monkey D. Luck — Sua próxima aventura',
  description: 'Uma experiência de cadastro acessível com o Monkey D. Luck.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
