import { usePersonStore } from "../stores/personsStore";

function GeneratorTable() {
    const personsMistakes = usePersonStore(state => state.personsMistakes);

    return ( 
        <table className="me-auto ms-auto mt-5 table table-striped table-hover border-2 persons-table">
            <tbody className="align-middle">
                {personsMistakes.map((personMistake, index) =>
                    <tr key={index}>
                        <th className="persons-table-num">
                            {index+1}
                        </th>
                        <th className="persons-table-id">
                            {personMistake.id}
                        </th>
                        <th className="persons-table-name">
                            {personMistake.fullName}
                        </th>
                        <th className="persons-table-adress">
                            {personMistake.address}
                        </th>
                        <th className="persons-table-phone">
                            {personMistake.phone}
                        </th>
                    </tr>)}
            </tbody>
        </table>
     );
}

export default GeneratorTable;