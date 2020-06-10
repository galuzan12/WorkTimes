import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../style/style.css';
function LoginPage({ user, setUser, setLoggedIn }) {

    const [prod, dev] = ['https://timesforworks.herokuapp.com', 'http://localhost:5000']

    const [URL, setUrl] = useState([`${prod}/login`, `${prod}/createUser`]);
    const [err, setErr] = useState('');
    const [login, setLogin] = useState(true);

    const handleSubmit = () => {
        const url = login ? URL[0] : URL[1];
        console.log("c");

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user.user, password: user.password })
        }).then(res => {
            if (!res.ok) throw Error(res.statusText);
            return res.json();
        }).then(result => {
            setUser(result);
            localStorage.setItem("user", JSON.stringify(result))
            setLoggedIn(true);
        }).catch(err => {
            const errMsg = "שם משתמש או סיסמה שגויים";
            setErr(errMsg);
        })
    }

    return (
        <React.Fragment>
            <Row className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Col md={6}>
                    <Col xs={12} className="headLineLogin">
                        מערכת נוכחות
                    </Col>
                    <Col xs={12}>
                        <input type="text" className="form-control rounded1 inputEnter" placeholder="הכנס שם משתמש" value={user.user || ''} onChange={e => setUser({ ...user, user: e.target.value })} />
                    </Col>
                    <Col xs={12}>
                        <input type="password" className="form-control rounded1 inputEnter" placeholder="הכנס סיסמה" value={user.password || ''} onChange={e => setUser({ ...user, password: e.target.value })} />
                    </Col>
                    <Col xs={12}>
                        {err}
                    </Col>
                    <Col xs={12}>
                        <input type="button" onClick={handleSubmit} value={login ? "כניסה" : "הרשמה"} className="btn btn-block rounded1 btnEnter" />
                    </Col>
                    <Col xs={12}>
                        <input type="button" onClick={e => setLogin(!login)} value={login ? "הרשמה" : "כניסה"} className="btn btn-block rounded1 btnEnter" />
                    </Col>
                </Col>
            </Row>
        </React.Fragment>
    );
}
export default LoginPage