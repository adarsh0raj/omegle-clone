import { useState } from "react"
import { Link } from "react-router-dom"

export const Home = () => {

    const [name, setName] = useState('')

    const onButtonClick = () => {
        window.location.href = `/room?name=${name}`

    }

    return (
        <>
            <div className="flex flex-column gap-4">
                <span>Name: </span>
                <input className="block rounded-md border-0 py-1 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                <Link to={`/room?name=${name}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Join Room</Link>
            </div>
        </>
    )
}