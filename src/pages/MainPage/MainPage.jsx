import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import axios from 'axios';
import PokeCard from '../../components/PokeCard';
import AutoComplete from '../../components/AutoComplete';

function MainPage() {
    const [allPokemons, setAllPokemons] = useState([]);
    const [displayPokemons, setDisplayPokemons] = useState([]);
    const limitNum = 20;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=1008&offset=0`;

    useEffect(() => {
        fetchPokeData();
    }, []);

    const filterDisplayedPokemonData = (allPokemonsData, displayPokemons = []) => {
        const limit = displayPokemons.length + limitNum;
        const arr = allPokemonsData.filter((pokemon, index) => index + 1 <= limit);
        return arr;
    };

    const fetchPokeData = async () => {
        try {
            const res = await axios.get(url);
            setAllPokemons(res.data.results);
            setDisplayPokemons(filterDisplayedPokemonData(res.data.results));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <article className="pt-6">
            <header className="flex flex-col gap-2 w-full px-4 z-50">
                <AutoComplete allPokemons={allPokemons} setDisplayPokemons={setDisplayPokemons} />
            </header>
            <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
                <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
                    {displayPokemons.length > 0 ? (
                        displayPokemons.map(({ url, name }, index) => <PokeCard key={index} url={url} name={name} />)
                    ) : (
                        <h2 className="font-medium text-lg text-slate-900 mb-1"> 포켓몬이 없습니다</h2>
                    )}
                </div>
            </section>

            <div className="text-center">
                {allPokemons.length > displayPokemons.length && displayPokemons.length !== 1 && (
                    <button
                        onClick={() => setDisplayPokemons(filterDisplayedPokemonData(allPokemons, displayPokemons))}
                        className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
                    >
                        더보기
                    </button>
                )}
            </div>
        </article>
    );
}

export default MainPage;
