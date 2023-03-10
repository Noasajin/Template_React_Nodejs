import {useParams} from "react-router-dom"
import axios from "axios"
import {BASE_URL} from "../tools/constante.js"
import {useState, useEffect, Fragment, useReducer} from "react"
import {initialState} from "../tools/context.js"
import {reducer} from "../tools/reducer.js"
import ConfirmationModal from "./ConfirmationModal.jsx"
import UploadFile from "./UploadFile.jsx"

const EditUsers = () => {
    const {id} = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [user, setUser] = useState('');
    const [successMessage, setSuccessMessage] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    
    useEffect(() => {
        axios.post(`${BASE_URL}/getUsersById`, {id})
            .then(res => {
                const data = res.data.result[0]
                data.birthdate = data.birthdate.split('T')[0]
                setUser(data)
            })
            .catch(err => console.log(err))
    }, [id])
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setUser({...user, [name]:value})
    }
    
    const openModal = (id) => {
        dispatch({type: 'openModal', payload: id})
    }
    
    const deleteUser = (id) => {
        axios.post(`${BASE_URL}/deleteUsersById`, {id})
        .then(res => {
            setIsDeleted(true);
            setIsDeleting(false);
            dispatch({type: 'confirmModal'});
        })
        .catch(err => console.log(err))
    }
    
    const closeModal = () => {
        dispatch({type: 'closeModal'});
    }
    
    const submit = (e) => {
        e.preventDefault()
        axios.post(`${BASE_URL}/editUsersById`, {...user})
        .then(res => {
            setSuccessMessage("Informations modifiées avec succès !");
        })
        .catch(err => console.log(err))
    }
    
    return (
        <Fragment>
            <ConfirmationModal isOpen={state.confirmOpen} onConfirm={() => deleteUser(state.payload)} onCancel={closeModal}/>
            {user && (
                <Fragment>
                {!isDeleting && successMessage && !isDeleted && (
                    <p>{successMessage}</p>
                )}
                {isDeleted && (
                    <p>Suppression effectuée avec succès !</p>
                )}
                <UploadFile />
                <h1>Modifier les informations</h1>
                <form onSubmit={submit}>
                    <input type='text' name='first_name' placeholder='Nouveau prénom' onChange={handleChange} value={user.first_name} />
                    <input type='text' name='last_name' placeholder='Nouveau nom' onChange={handleChange} value={user.last_name} />
                    <input type='text' name='email' placeholder='Nouvel e-mail' onChange={handleChange} value={user.email} />
                    <input type='date' name='birthdate' onChange={handleChange} value={user.birthdate} min="1923-01-01" max="2024-01-01" />
                    <select  name='roles_id' onChange={handleChange} value={user.roles_id}>
                        <option value='1'>Admin</option>
                        <option value='2'>User</option>
                    </select>
                    <input type='submit' />
                    <button onClick = {() => {
                    setIsDeleting(true);
                    openModal(user.id)}}>Supprimer</button>
                </form>
                </Fragment>
            )}
        </Fragment>
    )
}
    
export default EditUsers