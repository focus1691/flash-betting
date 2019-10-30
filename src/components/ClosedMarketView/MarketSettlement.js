import React from 'react'

export default () => {
    return (
        <div style={{width: '100%', height: '30%'}}>
            <div style={{height: '20%', backgroundColor: 'rgb(38, 194, 129)', color: 'white', paddingLeft: '1%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '1.5em', fontWeight: 'bold'}}>
                Sports Trading App Market Settlement
            </div>
            <div style={{paddingLeft: '1%', display: 'flex', flexDirection: 'column', height: '80%', justifyContent: 'center', border: 'solid 2px rgb(83, 221, 164)', borderTop: 'none'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p style={{fontSize: '1.5em', marginBottom: '0.5rem', fontFamily: 'Open Sans'}}>17:35 2m INHF Galway</p>
                    <em style={{color: 'gray',  fontWeight: '200'}}>Created Sat 26 Oct 2019 at 18:47 (commission not included)</em>
                </div>
                
                <a href="http://localhost:8080/dashboard" style={{marginTop: '2%', backgroundColor: 'rgb(38, 194, 129)', width: 'max-content', padding: '0.75% 1%', textDecoration: 'none', color: 'white'}}>Back To Dashboard →</a>
            </div>
        </div>
    )
}