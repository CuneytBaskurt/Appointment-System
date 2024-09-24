
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.delete('/deleteDoctor/:id', (req, res) => {
    const doktorId = req.params.id;
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({success: false, message: 'Veritabanına bağlanılamadı'});
        }
    });

    const sql = 'DELETE FROM Doktor WHERE doktor_tc = ?';
    db.run(sql, doktorId, function(err) {
        if (err) {
            return res.status(500).send({success: false, message: 'Doktor silinirken bir hata oluştu'});
        }
        res.send({success: true, message: 'Doktor başarıyla silindi', deletedRows: this.changes});
    });

    db.close();
});
