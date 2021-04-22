import Date from '../components/date'

export default function PostMeta({ category, date }) {
  return (
    <div>      
      <span className="mb-4 md:mb-0 text-lg">
        <Date dateString={date} />
      </span>
      <span> / </span>
      <span>{category.name}</span>
    </div>
  )
}
