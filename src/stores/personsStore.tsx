import { create } from 'zustand';
import { variables } from '../Variables';
import { IPerson } from '../types/person.interface';

interface PersonState {
    persons: IPerson[]
    setPersons: () => void
    setNewPersons: () => void
    personsMistakes: IPerson[]
    setPersonsMistakes: () => void
    seed: number
    setSeed: (seed: number) => void
    region: string
    setRegion: (region: string) => void
    mistakesNum: number
    setMistakesNum: (seed: number) => void
    page: number
    resetPage: () => void
    incPage: () => void
}

export const usePersonStore = create<PersonState>((set, get) => ({
    persons: [],
    setPersons: async () => {
        let response = await fetch(variables.API_URL + '/person/get?seed=' + get().seed + '&page=' + get().page + '&locale=' + get().region + '&countryLocal=' + variables.countryLocal[variables.locales.indexOf(get().region)]);
        let data = await response.json();
        set((state) => ({
            persons: state.persons.concat(data),
            personsMistakes: state.personsMistakes.concat(data)
        }))
    },
    setNewPersons: async () => {
        let tempArr: IPerson[] = [];
        const PERSONS_INIT_SETS = 3
        for (let i = 0; i < PERSONS_INIT_SETS; i++) {
            let response = await fetch(variables.API_URL + '/person/get?seed=' + get().seed + '&page=' + get().page + '&locale=' + get().region + '&countryLocal=' + variables.countryLocal[variables.locales.indexOf(get().region)]);
            let data = await response.json();
            tempArr = tempArr.concat(data)
            get().incPage();
        }
        set({
            persons: tempArr,
        })
    },
    personsMistakes: [],
    setPersonsMistakes: () => {
        let chance = 0;
        if(get().mistakesNum - Math.floor(get().mistakesNum) >= 0){
            chance = get().mistakesNum - Math.floor(get().mistakesNum);
            if(Math.random() <= chance){
                chance = 1;
            }
            else{
                chance = 0;
            }
        }
        let tempArr: IPerson[] = [];
        get().persons.forEach((person) => {
            let tempPerson:IPerson = {
                id: person.id,
                fullName: person.fullName,
                address: person.address,
                phone: person.phone,
                hash: person.hash
            };
            for (let i = 0; i < Math.floor(get().mistakesNum) + chance; i++) {
                const MISTAKES_NUM = 3
                let mistakeIdindex = Math.abs(variables.hashCode(tempPerson.id + i)) % MISTAKES_NUM;
                tempPerson.id = variables.mistakes[mistakeIdindex](get().seed, tempPerson.id, variables.locales.indexOf(get().region))
                let mistakeNameindex = Math.abs(variables.hashCode(tempPerson.fullName + i)) % MISTAKES_NUM;
                tempPerson.fullName = variables.mistakes[mistakeNameindex](get().seed, tempPerson.fullName, variables.locales.indexOf(get().region))
                let mistakeAddressindex = Math.abs(variables.hashCode(tempPerson.address + i)) % MISTAKES_NUM;
                tempPerson.address = variables.mistakes[mistakeAddressindex](get().seed, tempPerson.address, variables.locales.indexOf(get().region))
                let mistakePhoneindex = Math.abs(variables.hashCode(tempPerson.phone + i)) % MISTAKES_NUM;
                tempPerson.phone = variables.mistakes[mistakePhoneindex](get().seed, tempPerson.phone, variables.locales.indexOf(get().region))
            }
            tempArr.push(tempPerson);
        })
        set({
            personsMistakes: tempArr
        })
    },
    seed: Number(localStorage.getItem(variables.$SEED)) || 1234567,
    setSeed: (seed: number) => {
        let seedTemp;
        if (seed == 0) {
            seedTemp = Math.floor(Math.random() * 9999999);
            localStorage.setItem(variables.$SEED, String(seedTemp));
        }
        else {
            seedTemp = seed;
            localStorage.setItem(variables.$SEED, String(seedTemp));
        }
        set({
            seed: seedTemp
        })
    },
    region: localStorage.getItem(variables.$REGION) || 'en',
    setRegion: (region: string) => {
        localStorage.setItem(variables.$REGION, region);
        set({
            region: region
        })
    },
    mistakesNum: Number(localStorage.getItem(variables.$MISTAKES_NUM)) || 0,
    setMistakesNum: (mistakesNum: number) => {
        localStorage.setItem(variables.$MISTAKES_NUM, String(mistakesNum));
        set({
            mistakesNum: mistakesNum
        })
    },
    page: 1,
    resetPage: () => {
        set({
            page: 1
        })
    },
    incPage: () => {
        set({
            page: get().page + 1
        })
    }
}))