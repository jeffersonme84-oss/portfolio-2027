import { heroBooks } from '@/content/studying'
import { useLocale } from '@/hooks/useLocale'

// Pilha de livros sobre a mesa da cena da Home: os temas que o Jefferson estuda.
// Lombadas em HTML (texto nítido e traduzível); estilo e posição em hero.css (.hero-books).
export function HeroBooks() {
  const { t, l } = useLocale()

  return (
    <ul aria-label={t('hero.books')} className="hero-card hero-books">
      {heroBooks.map((book) => (
        <li
          key={book.id}
          className={`hero-book is-${book.tone}`}
          style={{ '--size': book.size } as React.CSSProperties}
        >
          <span className="hero-book-title">{l(book.title)}</span>
        </li>
      ))}
    </ul>
  )
}
