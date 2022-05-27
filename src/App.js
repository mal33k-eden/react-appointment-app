import './App.css';
import { useState, useEffect, useCallback} from 'react';
import {BiCalendar} from 'react-icons/bi'
import Search from './components/Search';
import AddAppointments from './components/AddAppointments';
import AppointmentInfo from './components/AppointmentInfo'; 
function App() {
  let [appointmentList, setAppointmentList] = useState([])
  let [query, setQuery] = useState('')
  let [sortBy, setSortBy] = useState("petName")
  let [orderBy, setOrderBy] = useState("asc")

  const filteredAppointments =appointmentList.filter(
    item =>{
      return (
        item.petName.toLowerCase().includes(query.toLocaleLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLocaleLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLocaleLowerCase()) 
      )
    }
  ).sort((a,b)=>{
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      (a[sortBy].toLowerCase() < b[sortBy].toLocaleLowerCase())
       ? - 1 * order 
       : 1 * order 
    )
  })

  const fetchData = useCallback(()=>{
    fetch('./data.json')
    .then(response => response.json())
    .then(data=>setAppointmentList(data));
  }, [])

  useEffect(()=>{
    fetchData()
  }, [fetchData]);

  return (
    <div className="App container mx-auto px-4 mt-3 font-thin">
      <h2 className='text-4xl mb-5'>
        <BiCalendar className="inline-block text-red-400 align-top"/>
        Your Appointments</h2>
        <AddAppointments
        onSendAppointmentData={myAppointment=>setAppointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max,item)=>Number(item.id) > max ? Number(item.id) : max,0)}
        />
        <Search query={query} onQueryChange={myQuery => setQuery(myQuery)}
                orderBy={orderBy} onOrderByChange={myOrderBy=> setOrderBy(myOrderBy)}
                sortBy={sortBy} onSortByChange={mySortBy=> setSortBy(mySortBy)}
        />

        <ul className='divided-y divided-gray-200'>
          {filteredAppointments.map(appointment =>(
            <AppointmentInfo
             key={appointment.id}
             appointment={appointment}
             onDeleteAppointment={
               appointmentId =>
               setAppointmentList(
                appointmentList.filter(
                 appointment=>appointment.id !== appointmentId
                )
              )
             }
             
             />
          ))}

        </ul>
    </div>
  );
}

export default App;
