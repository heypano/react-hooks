// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'
import {useEffect, useState} from 'react'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    console.log('ErrorBoundary', this.state.error)
    const {FallbackComponent} = this.props
    if (this.state.error) {
      return <FallbackComponent error={this.state.error} />
    }
    return this.props.children
  }
}
function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState()
  const [error, setError] = useState()
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!pokemonName) {
      return
    }
    setStatus('pending')

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setStatus('resolved')
        setPokemon(pokemonData)
      })
      .catch(error => {
        setStatus('rejected')
        setError(error)
      })
  }, [pokemonName])
  console.log('status', status)

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    // return <PokemonDataView pokemon={pokemon} />
    return <PokemonDataView pokemon={null} />
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
