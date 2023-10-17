import { ChangeEvent, useEffect } from 'react';
import { usePersonStore } from '../stores/personsStore';
import './Generator.css'
import { variables } from '../Variables';
import GeneratorTable from './GeneratorTable';
import { mkConfig, generateCsv, download } from "export-to-csv";

function Generator() {
    const seed = usePersonStore(state => state.seed);
    const setSeed = usePersonStore(state => state.setSeed);
    const region = usePersonStore(state => state.region);
    const setRegion = usePersonStore(state => state.setRegion);
    const mistakesNum = usePersonStore(state => state.mistakesNum);
    const setMistakesNum = usePersonStore(state => state.setMistakesNum);
    const persons = usePersonStore(state => state.persons);
    const setPersons = usePersonStore(state => state.setPersons);
    const setNewPersons = usePersonStore(state => state.setNewPersons);
    const personsMistakes = usePersonStore(state => state.personsMistakes);
    const setPersonsMistakes = usePersonStore(state => state.setPersonsMistakes);
    const resetPage = usePersonStore(state => state.resetPage);
    const incPage = usePersonStore(state => state.incPage);

    useEffect(() => {
        (() => {
            window.addEventListener('scroll', throttle(checkPosition, 500))
            window.addEventListener('resize', throttle(checkPosition, 500))
        })();
        (document.getElementById('selectRegion') as HTMLSelectElement).selectedIndex = variables.locales.indexOf(region);
        (document.getElementById('errorsInput') as HTMLInputElement).value = String(mistakesNum);
        (document.getElementById('errorsRange') as HTMLInputElement).value = String(mistakesNum);
        (document.getElementById('seedInput') as HTMLInputElement).value = String(seed)
        resetPage();
        setNewPersons();
    }, []);

    useEffect(() => {
        setPersonsMistakes();
    }, [mistakesNum]);

    useEffect(() => {
        setPersonsMistakes();
    }, [persons])

    const changeRegionHandler = () => {
        setRegion(variables.locales[(document.getElementById('selectRegion') as HTMLSelectElement).selectedIndex]);
        resetPage();
        setNewPersons();
    }

    const handleChangeMistakes = (event: React.FormEvent<HTMLInputElement>) => {
        const value = Math.max(variables.MIN_MISTAKES, Math.min(variables.MAX_MISTAKES, Number(event.currentTarget.value)));
        setMistakesNum(value);
        (document.getElementById('errorsRange') as HTMLInputElement).value = String(value);
        (document.getElementById('errorsInput') as HTMLInputElement).value = String(value);
    };

    const changeSeedHandler = (event: React.FormEvent<HTMLInputElement>) => {
        let value = Math.max(variables.MIN_SEED, Math.min(variables.MAX_SEED, Number(event.currentTarget.value)));
        setSeed(value);
        resetPage();
        setNewPersons();
        (document.getElementById('seedInput') as HTMLInputElement).value = String(value);
    };

    const clickShuffleSeedHandler = () => {
        let randSeed = Math.floor(Math.random() * 8999999 + 1000000);
        (document.getElementById('seedInput') as HTMLInputElement).value = String(randSeed);
        setSeed(randSeed);
        resetPage();
        setNewPersons();
    }

    function checkPosition() {
        const fullheight = document.getElementById('persons-table')!.offsetHeight;
        const innerHeight = window.innerHeight;

        const scrolled = window.scrollY;
        const threshold = fullheight - innerHeight / 8;
        const position = scrolled + innerHeight;
        if (position >= threshold) {
            incPage();
            setPersons();
        }
    }

    function throttle(callee: Function, timeout: number) {
        let timer: any = null;

        return function perform(...args: any[]) {
            if (timer) return;

            timer = setTimeout(() => {
                callee(...args);

                clearTimeout(timer);
                timer = null;
            }, timeout);
        }
    }

    const downloadCSV = () => {
        const csvConfig = mkConfig({ useKeysAsHeaders: true, fieldSeparator: ';', quoteStrings: true, filename: "persons_from_" + region });
        let arr: {}[] = [];
        personsMistakes.forEach(person => {
            arr.push({
                id: person.id,
                fullName: person.fullName,
                address: person.address,
                phone: person.phone
            })
        })
        const csv = generateCsv(csvConfig)(arr);
        download(csvConfig)(csv);
    }

    return (
        <div className="position-absolute d-flex flex-column main-window">
            <div className="position-fixed start-0 end-0 d-flex align-items-center justify-content-around generator-header p-3">
                <div className="d-flex align-items-center">
                    <div className='me-3'>
                        Region:
                    </div>
                    <select defaultValue={0} id='selectRegion' className="form-select" aria-label="selectRegion" onChange={changeRegionHandler}>
                        <option value={0}>USA</option>
                        <option value={1}>Russia</option>
                        <option value={2}>Poland</option>
                        <option value={3}>Germany</option>
                    </select>
                </div>
                <div className='d-flex align-items-center'>
                    <div className='me-3'>Errors:</div>
                    <input type="range" defaultValue={0} className="me-3" min="0" max="10" step="0.2" id="errorsRange" onChange={handleChangeMistakes} />
                    <input className='form-control' type="number" id="errorsInput" min="0" max="100" onChange={handleChangeMistakes} />
                </div>

                <div className='d-flex align-items-center'>
                    <div className='me-3'>Seed:</div>
                    <input className='form-control me-2' type="number" id="seedInput" min="0" max="9999999" onChange={changeSeedHandler} />
                    <h4 id='shuffle' onClick={clickShuffleSeedHandler} className='mb-1'>
                        <i className="bi bi-shuffle"></i>
                    </h4>

                </div>
                <button onClick={downloadCSV} className="btn btn-secondary ps-3 pe-3">Export</button>
            </div>
            <div id='persons-table' className='d-flex flex-column align-items-center flex-fill mt-5'>
                <GeneratorTable />
            </div>
        </div>
    );
}

export default Generator;