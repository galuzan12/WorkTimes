import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import EditRow from './Components/EditRow/EditRow';
import Table from './Components/Table/Table';
import logo from './logo.svg';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoginPage from './Components/LoginPage/LoginPage';

function App() {

  const [loggenIn, setLoggedIn] = useState(localStorage.getItem('user') ? true : false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) ||
  {
    user: '',
    password: '',
    id: ''
  });
  const [monthDate, setMonthDate] = useState(new Date());
  const [editBtn, setEditBtn] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sendRows, setSendRows] = useState(false);
  const [totalAdditionalHours, setTotalAdditionalHours] = useState(0);
  const [rows, setRows] = useState(localStorage.getItem('data') !== null ? JSON.parse(localStorage.getItem('data')) : []);
  const [newRow, setNewRow] = useState({
    state: false, date: new Date(), stringDate: '', enter: '', exit: '', total: '', needed: new Date().getDay() === 2 ? '8:00' : '8:30', additional: '', remarks: ''
  });
  const [editRow, setEditRow] = useState({
    rowIndex: -1, state: false, date: new Date(), stringDate: '', enter: '', exit: '', total: '', needed: new Date().getDay() === 2 ? '8:00' : '8:30', additional: '', remarks: ''
  });

  // add a new row
  const handleSave = () => {
    setInitialLoad(false);
    setSendRows(true);
    let tmpDate = newRow.date.toLocaleDateString();
    if (newRow.date.toLocaleDateString().includes('/')) {
      tmpDate = newRow.date.toLocaleDateString().split('/')
      tmpDate = `${tmpDate[1]}/${tmpDate[0]}/${tmpDate[2]}`;
    }
      // if (newRow.date.toLocaleDateString().includes('-')) tmpDate = newRow.date.toLocaleDateString().split('-')
    // if (newRow.date.toLocaleDateString().includes('-')) tmpDate = newRow.date.toLocaleDateString().split('-')
    if (newRow.exit !== '') {
      const { enter, exit, needed } = newRow;
      const [splitedEnter, splitedExit] = [enter.split(':'), exit.split(':')];
      const totalHours = (splitedExit[0] - splitedEnter[0]) * 60 + (splitedExit[1] - splitedEnter[1]);
      const neededHoursSplit = needed.split(':');
      const additionalHours = totalHours - (parseInt(neededHoursSplit[0]) * 60 + parseInt(neededHoursSplit[1]));
      console.log(totalHours % 60 < 10)
      setNewRow({ ...newRow, stringDate: tmpDate, total: `${parseInt(totalHours / 60)}:${totalHours % 60 < 10 ? '0' + totalHours % 60 : totalHours % 60}`, additional: additionalHours });
    }
    else setNewRow({ ...newRow, stringDate: tmpDate });
  }
  useEffect(() => {
    if (initialLoad) return;
    setInitialLoad(true);
    setRows([...rows, newRow]);
    setNewRow({ state: false, date: new Date(), stringDate: '', enter: '', exit: '', total: '', needed: new Date().getDay() === 2 ? '8:00' : '8:30', additional: '', remarks: '' })
  }, [newRow]);

  //delete the selected row
  const handleDeleteRow = e => {
    setSendRows(true);
    const rowIndex = e.target.parentElement.parentElement.childNodes[8].innerHTML.split('value="')[1].split('"')[0];
    setRows(rows.filter(item => item !== rows[rowIndex]));
    setEditBtn(!editBtn);
  }

  // sets the data on the edit component
  const handleEdit = e => {
    setSendRows(true);
    setEditBtn(!editBtn)
    const { rowIndex } = e.target.parentElement.parentElement;
    const { stringDate, date, enter, exit, total, needed, additional, remarks } = rows[rowIndex - 1];
    setEditRow({ stringDate, date: new Date(date), enter, exit, total, needed, additional, remarks, rowIndex: rowIndex - 1 });
  }

  // save the edited data 
  const handleEditSave = e => {
    setSendRows(true);
    setInitialLoad(false);
    const rowIndex = e.target.parentElement.parentElement.childNodes[8].innerHTML.split('value="')[1].split('"')[0];
    const { enter, exit, needed } = editRow;
    const [splitedEnter, splitedExit] = [enter.split(':'), exit.split(':')];
    const totalHours = (splitedExit[0] - splitedEnter[0]) * 60 + (splitedExit[1] - splitedEnter[1]);
    const neededHoursSplit = needed.split(':');
    const additionalHours = totalHours - (parseInt(neededHoursSplit[0]) * 60 + parseInt(neededHoursSplit[1]));
    setEditRow({ ...editRow, total: `${parseInt(totalHours / 60)}:${totalHours % 60}`, additional: additionalHours, rowIndex: parseInt(rowIndex) });
  }
  useEffect(() => {
    if (initialLoad) return;
    const notChosenRows = rows.filter((row, index) => editRow.rowIndex !== index);
    setRows(sortArrayByDate(editRow, notChosenRows));
    setInitialLoad(true);
    setEditBtn(false);
    setEditRow({
      rowIndex: -1, state: false, date: new Date(), stringDate: '', enter: '', exit: '', total: '', needed: new Date().getDay() === 2 ? '8:00' : '8:30', additional: '', remarks: ''
    })
  }, [editRow]);

  // once the rows is updated the local stoarge updates
  useEffect(() => {
    if (!sendRows) return;
    localStorage.setItem('data', JSON.stringify(rows));
    console.log("A");

    const URL = 'https://timesforworks.herokuapp.com/postData'; //http://localhost:5000/  https://timesforworks.herokuapp.com/
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rows, id: user.id })
    }).then(res => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    }).then(result => {
      console.log(result);
    }).catch(err => {

    })
    setTotalAdditionalHours(() => {
      let counter = 0;
      rows.forEach(row => {
        if (!isNaN(row.additional)) counter += row.additional
      });
      console.log(counter);

      return counter;
    })
  }, [rows]);

  // ONCE USER LOGIN FETCH ROWS FOR USER
  useEffect(() => {
    if (user.id === '') return;
    console.log("b");

    const URL = `https://timesforworks.herokuapp.com/?id=${user.id}`
    fetch(URL)
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then(result => {
        setRows(result.times);
        localStorage.setItem('data', JSON.stringify(result.times));

      })
      .catch(err => {
        // alert("לא הצליח למשוך נתונים מהDB, מציג רק מה שהזכרון במחשב ");
      })
  }, [user])

  const sortArrayByDate = (row, notChosenRows) => {
    const tmpArray = [...notChosenRows, row];
    for (let i = 0; i < tmpArray.length; i++) {
      for (let j = i + 1; j < tmpArray.length; j++) {
        if (new Date(tmpArray[i].date) > new Date(tmpArray[j].date)) {
          let tmpRow = tmpArray[i];
          tmpArray[i] = tmpArray[j];
          tmpArray[j] = tmpRow;
        }
      }
    }
    return tmpArray;
  }


  return (
    <Container fluid>
      {loggenIn ?
        <React.Fragment>
          <DatePicker className="form-control DatePickerClass" selected={monthDate} onChange={date => setMonthDate(date)} dateFormat="MM/yyyy" showMonthYearPicker />
          {editBtn && <EditRow editRow={editRow} setEditRow={setEditRow} handleSave={handleEditSave} handleDeleteRow={handleDeleteRow} />}
          <div dir="rtl" className="App">
            <Table rows={rows} handleEdit={handleEdit} monthDate={monthDate} newRow={newRow} setNewRow={setNewRow} handleSave={handleSave} totalAdditionalHours={totalAdditionalHours} />
          </div>
        </React.Fragment>
        :
        <LoginPage user={user} setUser={setUser} setLoggedIn={setLoggedIn} />
      }

    </Container>
  );
}

export default App;
