interface Props {
  params: {
    slug: string
  }
}

const BookPage = ({ params }: Props) => {
  const { slug } = params
  
  return (
    <div>Book: {slug}</div>
  )
}

export default BookPage