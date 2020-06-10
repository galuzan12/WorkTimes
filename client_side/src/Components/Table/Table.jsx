import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function EditRow({ rows, handleEdit, newRow, monthDate, setNewRow, handleSave, totalAdditionalHours }) {
    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col md={3} xs={6}>
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btnEnter rounded1"
                        table="table-to-xls"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="הורד לאקסל"
                    />
                </Col>
            </Row>
            <p className="remark">***בשדות שעת כניסה/שעת יציאה/כמה נוספות יש להכניס 2 ספרות -> נקודותיים -> 2 ספרות</p>
            <div className="tableDiv">
            <table id="table-to-xls" width="100%" border="1">
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>שעת כניסה</th>
                        <th>שעת יציאה</th>
                        <th>סה"כ</th>
                        <th>כמה צריך</th>
                        <th>כמה נוספות</th>
                        <th>הערות</th>
                        <th>עריכה</th>
                    </tr>
                </thead>
                <tbody>

                    {rows.map((row, index) => new Date(row.date).toLocaleDateString().split('/')[0] === monthDate.toLocaleDateString().split('/')[0] ?
                        < tr key={index} >
                            <td>{row.stringDate === '' ? row.date : row.stringDate}</td>
                            <td>{row.enter}</td>
                            <td>{row.exit}</td>
                            <td>{row.total}</td>
                            <td>{row.needed}</td>
                            <td>{row.additional}</td>
                            <td>{row.remarks}</td>
                            <td><button onClick={handleEdit} className="btn btn-block btnTable">עריכה</button></td>
                        </tr> : null
                    )}
                    {newRow.state ?
                        <tr>
                            <td> <DatePicker maxDate={new Date()} selected={newRow.date} onChange={date => setNewRow({ ...newRow, date: date, needed: date.getDay() === 2 ? '8:00' : '8:30' })} dateFormat="dd/MM/yyyy" /> </td>
                            <td> <input type="text" onChange={e => setNewRow({ ...newRow, enter: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(newRow.enter) ? null : setNewRow({ ...newRow, enter: "" })} className="form-control" value={newRow.enter} /> </td>
                            <td> <input type="text" onChange={e => setNewRow({ ...newRow, exit: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(newRow.exit) ? null : setNewRow({ ...newRow, exit: "" })} className="form-control" value={newRow.exit} /> </td>
                            <td> <input type="text" readOnly={true} className="form-control" value={newRow.total} /> </td>
                            <td> <input type="text" onChange={e => setNewRow({ ...newRow, needed: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(newRow.needed) ? null : setNewRow({ ...newRow, needed: "" })} className="form-control" value={newRow.needed} /> </td>
                            <td> <input type="text" readOnly={true} className="form-control" value={newRow.additional} /> </td>
                            <td> <input type="text" onChange={e => setNewRow({ ...newRow, remarks: e.target.value })} className="form-control" value={newRow.remarks} /> </td>
                            <td>
                                <button onClick={e => setNewRow({ ...newRow, state: false })} className="btn btn-block btnCancel">ביטול</button>
                                <button onClick={handleSave} className="btn btn-block btnTable">שמירה</button>
                            </td>
                        </tr> :
                        <tr>
                            <td><button onClick={e => setNewRow({ ...newRow, state: true })} className="btn btn-block btnTable">הוסף שורה</button></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalAdditionalHours}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    }
                </tbody>
            </table >
            </div>
        </React.Fragment>
    );
}
export default EditRow