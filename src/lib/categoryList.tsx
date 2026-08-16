import type { FC } from 'hono/jsx'
import type { CategoryEntry } from './manifest'

export const CategorySection: FC<{ category: CategoryEntry }> = ({ category }) => (
  <section class="category">
    <h3>{category.label}</h3>
    <p>{category.description}</p>
    <ul class="index-list">
      {category.pages.map((p) => (
        <li>
          <span class="badge">{p.difficulty}</span> <a href={p.path}>{p.title}</a> — {p.description}
        </li>
      ))}
    </ul>
  </section>
)
