import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
import PokeCard from './components/PokeCard';
import { useDebounce } from './hooks/useDebounce';

function App() {
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchPokeData(true);
    }, []);

    useEffect(() => {
        handelSearchInput(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const fetchPokeData = async isFirstFetch => {
        try {
            const offsetValue = isFirstFetch ? 0 : offset + limit;
            const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offsetValue}`;
            const res = await axios.get(url);
            setPokemons([...pokemons, ...res.data.results]);
            setOffset(offsetValue);
        } catch (error) {
            console.log(error);
        }
    };

    const handelSearchInput = async term => {
        if (term.length > 0) {
            try {
                const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${term}`);
                const pokemonData = {
                    url: `https://pokeapi.co/api/v2/pokemon/${res.data.id}`,
                    name: term,
                };
                console.log(pokemons);
                setPokemons([pokemonData]);
            } catch (error) {
                setPokemons([]);
                console.log(error);
            }
        } else {
            fetchPokeData(true);
        }
    };

    return (
        <article className="pt-6">
            <header className="flex flex-col gap-2 w-full px-4 z-50">
                <div className="relative z-50">
                    <form action="" className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
                        />
                        <button
                            type="submit"
                            className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
                        >
                            검색
                        </button>
                    </form>
                </div>
            </header>
            <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
                <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
                    {pokemons.length > 0 ? (
                        pokemons.map(({ url, name }, index) => <PokeCard key={index} url={url} name={name} />)
                    ) : (
                        <h2 className="font-medium text-lg text-slate-900 mb-1"> 포켓몬이 없습니다</h2>
                    )}
                </div>
            </section>

            <div className="text-center">
                <button
                    onClick={() => fetchPokeData(false)}
                    className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
                >
                    더보기
                </button>
            </div>
        </article>
    );
}

export default App;
