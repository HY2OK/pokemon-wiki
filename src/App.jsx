import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
import PokeCard from './components/PokeCard';

function App() {
    const [pokemons, setPokemons] = useState(0);

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0';

    useEffect(() => {
        fetchPokeData();
    }, []);

    const fetchPokeData = async () => {
        try {
            const res = await axios.get(url);
            setPokemons(res.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <article className="pt-6">
            <header className="flex flex-col gap-2 w-full px-4 z-50"></header>
            <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
                <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
                    {pokemons.length > 0 ? (
                        pokemons.map(({ url, name }, index) => <PokeCard key={index} url={url} name={name} />)
                    ) : (
                        <h2 className="font-medium text-lg text-slate-900 mb-1"> 포켓몬이 없습니다</h2>
                    )}
                </div>
            </section>
        </article>
    );
}

export default App;
