export function meta() {
  return [
    { title: 'FutuBrowser' },
    { name: 'description', content: 'Welcome to FutuBrowser!' },
  ]
}

export default function Home() {
  fetch('https://jsonplaceholder.typicode.com/albums/1/photos')
    .then((response) => response.json())
    .then((json) => console.log(json))
  return (
    <>
      <div className="h-full w-full">
        <p>This is Futubrowser!</p>
      </div>
    </>
  )
}
