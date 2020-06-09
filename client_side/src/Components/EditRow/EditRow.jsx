import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";

function EditRow({ editRow, setEditRow, handleSave, handleDeleteRow }) {
    return (
        <Row className="editDiv d-flex justify-content-center justify-content-center">
            <Col xs={3}> <label htmlFor="">תאריך</label> <DatePicker maxDate={new Date()} selected={editRow.date} onChange={date => setEditRow({ ...editRow, date: date, needed: date.getDay() === 2 ? '8:00' : '8:30' })} dateFormat="dd/MM/yyyy" /> </Col>
            <Col xs={3}> <label htmlFor="">שעת כניסה</label> <input type="text" onChange={e => setEditRow({ ...editRow, enter: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(editRow.enter) ? null : setEditRow({ ...editRow, enter: "" })} className="form-control" value={editRow.enter} /> </Col>
            <Col xs={3}> <label htmlFor="">שעת יציאה</label> <input type="text" onChange={e => setEditRow({ ...editRow, exit: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(editRow.exit) ? null : setEditRow({ ...editRow, exit: "" })} className="form-control" value={editRow.exit} /> </Col>
            <Col xs={3}> <label htmlFor="">סה"כ</label> <input type="text" onChange={e => setEditRow({ ...editRow, total: e.target.value })} className="form-control" value={editRow.total} /> </Col>
            <Col xs={3}> <label htmlFor="">כמה צריך</label> <input type="text" onChange={e => setEditRow({ ...editRow, needed: e.target.value })} onBlur={e => /^[0-9]{1,2}:[0-9]{2}$/g.test(editRow.needed) ? null : setEditRow({ ...editRow, needed: "" })} className="form-control" value={editRow.needed} /> </Col>
            <Col xs={3}> <label htmlFor="">כמה נוספות</label> <input type="text" onChange={e => setEditRow({ ...editRow, additional: e.target.value })} className="form-control" value={editRow.additional} /> </Col>
            <Col xs={3}> <label htmlFor="">הערות</label> <input type="text" onChange={e => setEditRow({ ...editRow, remarks: e.target.value })} className="form-control" value={editRow.remarks} /> </Col>
            <Col xs={3}> <label htmlFor="">עריכה</label> <button onClick={handleSave} className="btn btn-primary btn-block">שמירה</button> <button onClick={handleDeleteRow} className="btn btn-danger btn-block">מחיקה</button> </Col>
            <Col xs={3}> <input type="hidden" value={editRow.rowIndex} /> </Col>
        </Row>
    );
}
export default EditRow