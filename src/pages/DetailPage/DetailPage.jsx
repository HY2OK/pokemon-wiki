import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
    const params = useParams();
    const pokemonId = params.id;
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

    const [pokemon, setPokemon] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPokemonData();
    }, []);

    async function fetchPokemonData() {
        const url = `${baseUrl}${pokemonId}`;
        try {
            const { data: pokemonData } = await axios.get(url);

            if (pokemonData) {
                const { name, id, types, weight, height, stats, abilities } = pokemonData;
                const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

                const DamageRelations = await Promise.all(
                    types.map(async i => {
                        const type = await axios.get(i.type.url);
                        return type.data.damage_relations;
                    }),
                );

                const formattedPokemonData = {
                    id,
                    name,
                    weight: weight / 10,
                    height: height / 10,
                    previous: nextAndPreviousPokemon.previous,
                    next: nextAndPreviousPokemon.next,
                    abilities: formatPokemonAbilities(abilities),
                    stats: formatPokemonStats(stats),
                    DamageRelations,
                };
                setPokemon(formattedPokemonData);
                setIsLoading(false);

                console.log(formattedPokemonData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatPokemonStats = ([statHP, statATK, statDEP, statSATK, statSDEP, statSPD]) => [
        { name: 'HIT Points', baseState: statHP.base_stat },
        { name: 'Attack', baseState: statATK.base_stat },
        { name: 'Defense', baseState: statDEP.base_stat },
        { name: 'Special Attack', baseState: statSATK.base_stat },
        { name: 'Special Defense', baseState: statSDEP.base_stat },
        { name: 'Speed', baseState: statSPD.base_stat },
    ];

    const formatPokemonAbilities = abilities => {
        return abilities.filter((ability, index) => index <= 1).map(obj => obj.ability.name.replaceAll('-', ' '));
    };

    async function getNextAndPreviousPokemon(id) {
        const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
        const { data: pokemonData } = await axios.get(urlPokemon);

        const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
        const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));

        return {
            next: nextResponse?.data?.results?.[0]?.name,
            previous: previousResponse?.data?.results?.[0]?.name,
        };
    }

    return <div>DetailPage</div>;
};

export default DetailPage;
