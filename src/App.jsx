import { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  const [cards, setCards] = useState([])
  const [clickedCards, setClickedCards] = useState([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    if (cards.length > 0) {
      shuffleCards()
    }
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=16')
      const data = await response.json()
      const fetchedCards = await Promise.all(data.results.map(async (pokemon, index) => {
        const pokemonResponse = await fetch(pokemon.url)
        const pokemonData = await pokemonResponse.json()
        return {
          id: index + 1,
          name: pokemon.name,
          image: pokemonData.sprites.front_default
        }
      }))
      setCards(fetchedCards)
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }

  const handleCardClick = (id) => {
    if (clickedCards.includes(id)) {
      setScore(0)
      setClickedCards([])
    } else {
      const newScore = score + 1
      setScore(newScore)
      setClickedCards([...clickedCards, id])
      if (newScore > bestScore) {
        setBestScore(newScore)
      }
    }
    shuffleCards()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">Memory Card Game</h1>
        <div className="flex justify-between w-full mb-6">
          <p className="text-4xl font-bold mb-8 text-blue-600">Score: {score}</p>
          <p className="text-4xl font-bold mb-8 text-blue-600">Best Score: {bestScore}</p>
        </div>
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {cards.slice(0, 16).map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer w-full aspect-square"
              onClick={() => handleCardClick(card.id)}
            >
              <img src={card.image} alt={card.name} className="w-full h-3/4 object-cover" />
              <p className="text-center py-2 px-4 text-gray-800 font-medium h-1/4 flex items-center justify-center">{card.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App