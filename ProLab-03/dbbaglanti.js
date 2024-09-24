
/*

port:1000 = HASTA KAYIT
port:2000 = DOKTOR EKLEME
port:3000 = ADMİN PANELİ AÇILIŞ
port:4000 = EMAİL-ŞİFRE KARŞILAŞTIRMASI
port:5000 = HASTA PANELİ
port:5500 = DOKTOR PANELİ
port:3500 = DOKTOR GUNCELLE PANELİ
port:2500 = DOKTOR SİLME PANELİ

*/



const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 1000;

//HASTA EKLEME
// Windows için dosya yolu örneği, kendi yoluza göre değiştirin
const dbPath = 'C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\mhrs.db';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya'));


app.get('/', (req, res) => {
  res.sendFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\kayit.html');

});

app.post('/add', (req, res) => {
  let db = new sqlite3.Database(dbPath);
  let sql = `INSERT INTO hasta (hasta_tc, hasta_ad, hasta_soyad, hasta_tel, hasta_email, hasta_parola) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [req.body.TC, req.body.isim, req.body.soyisim, req.body.telefon, req.body.email, req.body.parola], function(err) {
    if (err) {
      console.error(err.message);
      res.send("Veritabanı hatası: " + err.message);
    } else {
      console.log(`A record has been inserted with rowid ${this.lastID}`);
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Close the database connection.');
        res.redirect('/');
      });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





//*****************************************************************************************************************************************************************




//DOKTOR EKLEME

const app2 = express();
const port2 = 2000;


app2.use(bodyParser.urlencoded({ extended: true }));
app2.use(express.static('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya'));


app2.get('//', (req, res) => {
  res.sendFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\drEkle.html');

});


app2.post('/add', (req, res) => {
  let db = new sqlite3.Database(dbPath);
  let sql = `INSERT INTO Doktor (doktor_ad, doktor_soyad, doktor_unvan, doktor_parola, doktor_email) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [req.body.isim, req.body.soyisim, req.body.unvan, req.body.parola, req.body.email], function(err) {
    if (err) {
      console.error(err.message);
      res.send("Veritabanı hatası: " + err.message);
    } else {
      console.log(`A record has been inserted with rowid ${this.lastID}`);
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Close the database connection.');
        res.redirect('/');
      });
    }
  });
});



app2.listen(port2, () => {
  console.log(`Server is running on http://localhost:${port2}`);
});







//*****************************************************************************************************************************************************************



const http = require('http');
const fs = require('fs');

const db = new sqlite3.Database('mhrs.db'); // Veritabanını açıyoruz

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

    db.all('SELECT * FROM Doktor', function(err, rows) {
        if (err) {
            console.error(err.message);
            return;
        }

        let selectOptions = '<option value="0"></option>';

        rows.forEach(function(row) {
            selectOptions += `<option value="${row.doktor_tc}">${row.doktor_ad}</option>`;
        });

        fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\admin.html', 'utf8', function(err, data) {
            if (err) {
                console.error(err.message);
                return;
            }

            // Combobox içine doktorları ekliyoruz
            const result = data.replace('</select>', `${selectOptions}</select>`);

            // CSS dosyasının içeriğini okuyoruz
            fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\admin.css', 'utf8', function(err, cssData) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);

                res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
            });
        });
    });


    
});




server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});






//*****************************************************************************************************************************************************************





const app3 = express();
const port3 = 4000;

// Body parser middleware
app3.use(bodyParser.urlencoded({ extended: true }));
app3.use(bodyParser.json());

// Open the database
let db2 = new sqlite3.Database('./mhrs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the MHRS database.');
    }
});

// Route for handling login
app3.post('/login', (req, res) => {
    const { email, parola } = req.body;

    // SQL query to find the user
    const sql = `SELECT hasta_email AS email, hasta_parola AS parola, 'Hasta' AS role FROM hasta WHERE hasta_email = ? AND hasta_parola = ?
    UNION
    SELECT doktor_email AS email, doktor_parola AS parola, 'Doktor' AS role FROM doktor WHERE doktor_email = ? AND doktor_parola = ?
    UNION
    SELECT yonetici_email AS email, yonetici_parola AS parola, 'Yonetici' AS role FROM yonetici WHERE yonetici_email = ? AND yonetici_parola = ?
    
    `;



    db2.get(sql, [email, parola, email, parola, email, parola], (err, row) => {
        if (err) {
            res.status(500).send('Database error: ' + err.message);
        } else if (row) {
            // User found, now insert email into Gecici table
            const insertSql = 'INSERT INTO Gecici (email) VALUES (?)';
            db2.run(insertSql, [email], insertErr => {
                if (insertErr) {
                    return res.status(500).send('Error inserting into Gecici: ' + insertErr.message);
                }
                // Redirect user based on their role
                if (row.role === 'Hasta') {
                    res.redirect('http://localhost:5000/');
                } else if (row.role === 'Doktor') {
                    res.redirect('http://localhost:5500/');
                } else if (row.role === 'Yonetici') {
                    res.redirect('http://localhost:3000/');
                }
            });
        } else {
            res.status(401).send('Unauthorized: No such user');
        }
    });
});

app3.listen(port3, () => {
    console.log(`Server running on port ${port3}`);
});



//*********************************************************************************************************************** 


const app4 = express();
const port4 = 5000;


app4.use(bodyParser.urlencoded({ extended: true }));
app4.use(express.static('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya'));


app4.get('//', (req, res) => {
  res.sendFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\hasta.html');

});


app4.listen(port4, () => {
  console.log(`Server is running on http://localhost:${port4}`);
});


//********************************************************************************************************* 


const app5 = express();
const port5 = 5500;
const http2 = require('http');
const fs2 = require('fs');






const server2 = http2.createServer((req, res) => {
    if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html'});

    db.all('SELECT * FROM Hasta', function(err, rows) {
        if (err) {
            console.error(err.message);
            return;
        }

        let selectOptions = '';

        rows.forEach(function(row) {
            selectOptions += `<option value="${row.hasta_tc}">${row.hasta_ad}</option>`;
        });

        fs2.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\doktor.html', 'utf8', function(err, data) {
            if (err) {
                console.error(err.message);
                return;
            }

            // Combobox içine doktorları ekliyoruz
            const result = data.replace('</select>', `${selectOptions}</select>`);

            // CSS dosyasının içeriğini okuyoruz
            fs2.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\doktor.css', 'utf8', function(err, cssData) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);

                res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
            });
        });
    });
}else if (req.method === 'POST' && req.url === '/api/h_guncelle') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Collect the data
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const { tc, isim, soyisim, telefon, boy, kilo } = data;

            // Update the doctor in the database
            db.run('UPDATE Hasta SET hasta_ad = ?, hasta_soyad = ?, hasta_tel = ?, hasta_boy = ?, hasta_kilo = ? WHERE hasta_tc = ?', [isim, soyisim, telefon, boy, kilo, tc], function(err) {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: false, message: 'Database update error: ' + err.message }));
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: true }));
                }
            });
        } catch (error) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: 'Bad request: ' + error.message }));
        }
    });
}
});


server2.listen(5500, () => {
  console.log('Server running at http://localhost:5500/');
});

//**************************************************************************************************** */





const url = require('url');

const db3 = new sqlite3.Database('mhrs.db');

const server3 = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        db3.all('SELECT * FROM Doktor', function(err, rows) {
            if (err) {
                console.error(err.message);
                return;
            }

            let selectOptions = '<option value="0">Doktor Seçiniz</option>';

            rows.forEach(function(row) {
                selectOptions += `<option value="${row.doktor_tc}">${row.doktor_ad}</option>`;
            });

            fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\drGuncelle.html', 'utf8', function(err, data) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                const result = data.replace('</select>', `${selectOptions}</select>`);
                fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\drGuncelle.css', 'utf8', function(err, cssData) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);
                    res.end(finalResult);
                });
            });
        });
    } else if (req.method === 'POST' && req.url === '/api/guncelle') {
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString(); // Collect the data
      });
      req.on('end', () => {
          try {
              const data = JSON.parse(body);
              const { tc, isim, soyisim, unvan, password, confirm_password } = data;

              // Update the doctor in the database
              db3.run('UPDATE Doktor SET doktor_ad = ?, doktor_soyad = ?, doktor_unvan = ?, doktor_parola = ? WHERE doktor_tc = ?', [isim, soyisim, unvan, password, tc], function(err) {
                  if (err) {
                      res.writeHead(500, {'Content-Type': 'application/json'});
                      res.end(JSON.stringify({ success: false, message: 'Database update error: ' + err.message }));
                  } else {
                      res.writeHead(200, {'Content-Type': 'application/json'});
                      res.end(JSON.stringify({ success: true }));
                  }
              });
          } catch (error) {
              res.writeHead(400, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({ success: false, message: 'Bad request: ' + error.message }));
          }
      });
  }
});

server3.listen(3500, () => {
    console.log('Server running at http://localhost:3500/');
});

//********************************************************************************************************* 



const db4 = new sqlite3.Database('mhrs.db'); // Veritabanını açıyoruz

const server4 = http.createServer((req, res) => {

  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html'});

    db4.all('SELECT * FROM Doktor', function(err, rows) {
        if (err) {
            console.error(err.message);
            return;
        }

        let selectOptions = '<option value="0"></option>';

        rows.forEach(function(row) {
            selectOptions += `<option value="${row.doktor_tc}">${row.doktor_ad}</option>`;
        });

        fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\drSil.html', 'utf8', function(err, data) {
            if (err) {
                console.error(err.message);
                return;
            }

            // Combobox içine doktorları ekliyoruz
            const result = data.replace('</select>', `${selectOptions}</select>`);

            // CSS dosyasının içeriğini okuyoruz
            fs.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\drSil.css', 'utf8', function(err, cssData) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);

                res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
            });
        });
    });
  }else if (req.method === 'POST' && req.url === '/api/sil') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Collect the data
    });

    req.on('end', () => {
      try {
          const data = JSON.parse(body);
          const {tc} = data;

          // Update the doctor in the database
          db.run('DELETE FROM Doktor WHERE doktor_tc= ?', [tc], function(err) {
              if (err) {
                  res.writeHead(500, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({ success: false, message: 'Database update error: ' + err.message }));
              } else {
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({ success: true }));
              }
          });
      } catch (error) {
          res.writeHead(400, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ success: false, message: 'Bad request: ' + error.message }));
      }
  });

  }
 
});

server4.listen(2500, () => {
    console.log('Server running at http://localhost:2500/');
});

//********************************************************************************************************* 


const fs5 = require('fs');


const db5 = new sqlite3.Database('mhrs.db');

const server5 = http.createServer((req, res) => {

    if (req.url === '/' || req.url.startsWith('/index')) {
        db5.all('SELECT * FROM Hasta', function(err, rows) {
            if (err) {
                console.error(err.message);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası.');
                return;
            }

            let selectOptions = '<option value="0">Seçiniz</option>';
            rows.forEach(function(row) {
                selectOptions += `<option value="${row.hasta_tc}">${row.hasta_ad}</option>`;
            });

            fs5.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\rapor.html', 'utf8', function(err, data) {
                if (err) {
                    console.error(err.message);
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end('Dosya okuma hatası.');
                    return;
                }

                const result = data.replace('</select>', `${selectOptions}</select>`);
                fs5.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\rapor.css', 'utf8', function(err, cssData) {
                    if (err) {
                        console.error(err.message);
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end('CSS dosya hatası.');
                        return;
                    }

                    const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(finalResult);
                });
            });
        });
    } else if (req.url.startsWith('/doktor')) {
        const queryObject = url.parse(req.url, true).query;
        db5.get('SELECT rapor_icerik FROM Tıbbi_Rapor WHERE rapor_ıd = ?', [queryObject.tc], (err, row) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası: ' + err.message);
                return;
            }
            if (row) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`Rapor İçeriği: ${row.rapor_icerik}`);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Hasta bulunamadı.');
            }
        });
    }else if(req.url.startsWith('/guncelle') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Veriyi string olarak biriktir.
        });
        req.on('end', () => {
            const data = JSON.parse(body); // Veriyi JSON olarak parse et.
            const hastaTC = data.tc;
            const raporIcerik = data.rapor;
            db5.run('UPDATE Tıbbi_Rapor SET rapor_icerik = ? WHERE rapor_sahip_ıd = ?', [raporIcerik, hastaTC], function(err) {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Veritabanı hatası: ' + err.message);
                    return;
                }
                if (this.changes > 0) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Rapor başarıyla güncellendi.');
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Hasta bulunamadı.');
                }
            });
        });
    }
    
    
     else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Yol bulunamadı');
    }
});

server5.listen(4500, () => {
    console.log('Server running at http://localhost:4500/');
});

//**************************************************************************************************************************

const fs6 = require('fs');


const db6 = new sqlite3.Database('mhrs.db');

const server6 = http.createServer((req, res) => {

   

     if(req.url === '/' || req.url.startsWith('/index')) {
        db6.all('SELECT * FROM Hasta', function(err, rows) {
            if (err) {
                console.error(err.message);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası.');
                return;
            }

            let selectOptions = '<option value="0">Seçiniz</option>';
            rows.forEach(function(row) {
                selectOptions += `<option value="${row.hasta_tc}">${row.hasta_ad}</option>`;
            });

            fs6.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\gecmis.html', 'utf8', function(err, data) {
                if (err) {
                    console.error(err.message);
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end('Dosya okuma hatası.');
                    return;
                }

                const result = data.replace('</select>', `${selectOptions}</select>`);
                fs6.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\gecmis.css', 'utf8', function(err, cssData) {
                    if (err) {
                        console.error(err.message);
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end('CSS dosya hatası.');
                        return;
                    }

                    const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(finalResult);
                });
            });
        });
    }else if (req.url.startsWith('/gecmis_bilgi')) {
        const queryObject = new url.parse(req.url, true).query;
        db5.get('SELECT * FROM Hasta WHERE hasta_tc = ?', [queryObject.tc], (err, row) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası: ' + err.message);
                return;
            }
            if (row) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(row));
            }
             else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Hasta bulunamadı.');
            }
        });
    }

    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Yol bulunamadı');
    }

});

server6.listen(1500, () => {
    console.log('Server running at http://localhost:1500/');
});

//***********************************************************************************************************************


const fs7 = require('fs');
const url2 = require('url');

const db7 = new sqlite3.Database('mhrs.db'); // Veritabanını açıyoruz

const server7 = http.createServer((req, res) => {
    const parsedUrl = url2.parse(req.url, true); // URL'yi ayrıştır
    const path = parsedUrl.pathname; // Yolu al
    // Yanıtın gönderilip gönderilmediğini kontrol etmek için bir bayrak kullanıyoruz
    let responseSent = false;

    if (path === '/' || path.startsWith('/index')) {
        db7.all('SELECT * FROM Doktor', function (err, rows) {
            if (err) {
                console.error(err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            let selectOptions = rows.map(row => `<option value="${row.doktor_tc}">${row.doktor_ad}</option>`).join('');

            fs7.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\randevuAl.html', 'utf8', function (err, data) {
                if (err) {
                    console.error(err.message);
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Dosya okuma hatası: ' + err.message);
                        responseSent = true;
                    }
                    return;
                }

                // Combobox içine doktorları ekliyoruz
                const result = data.replace('</ select>', `${selectOptions}</select>`);

                // CSS dosyasının içeriğini okuyoruz
                fs7.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\randevuAl.css', 'utf8', function (err, cssData) {
                    if (err) {
                        console.error(err.message);
                        if (!responseSent) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('CSS dosyası okuma hatası: ' + err.message);
                            responseSent = true;
                        }
                        return;
                    }

                    // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                    const finalResult = result.replace('</head>', `<style>${cssData}</style></head>`);

                    if (!responseSent) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
                        responseSent = true;
                    }
                });
            });
        });
    } else if (path === '/randevual' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const queryObject = JSON.parse(body);
                console.log('POST verileri alındı:', queryObject);

                // Önce email değerini çekiyoruz
                db7.get('SELECT email FROM Gecici WHERE ıd = 1', (err, row) => {
                    if (err) {
                        console.error('Email çekme hatası:', err.message);
                        if (!responseSent) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Veritabanı hatası email çekerken: ' + err.message);
                            responseSent = true;
                        }
                        return;
                    }

                    const hastaEmail = row ? row.email : null; // Email değerini alıyoruz
                    console.log('Hasta email:', hastaEmail);

                    if (!hastaEmail) {
                        if (!responseSent) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Veritabanı hatası: Hasta email bulunamadı');
                            responseSent = true;
                        }
                        return;
                    }

                    // Şimdi Randevu tablosuna yeni kayıt ekliyoruz
                    
                    db7.run('INSERT INTO Randevu (randevu_sehir, randevu_ilce, randevu_hastane, randevu_poliklinik, randevu_doktor_ıd, randevu_tarih, randevu_saat, hasta_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [queryObject.sehir, queryObject.ilce, queryObject.hastane, queryObject.poliklinik, queryObject.doktor, queryObject.tarih, queryObject.saat, hastaEmail],
                        function (err) {
                            if (err) {
                                console.error('Randevu ekleme hatası:', err.message);
                                if (!responseSent) {
                                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                                    res.end('Veritabanı hatası randevu eklerken: ' + err.message);
                                    responseSent = true;
                                }
                                return;
                            }
                            console.log('Randevu başarıyla eklendi:', queryObject);

                            if (!responseSent) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Randevu başarıyla alındı!' }));
                                responseSent = true;
                            }
                        }
                    );
                    db7.run('INSERT INTO Gecmis (randevu_sehir, randevu_ilce, randevu_hastane, randevu_poliklinik, randevu_doktor_ıd, randevu_tarih, randevu_saat, hasta_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [queryObject.sehir, queryObject.ilce, queryObject.hastane, queryObject.poliklinik, queryObject.doktor, queryObject.tarih, queryObject.saat, hastaEmail],
                        function (err) {
                            if (err) {
                                console.error('Randevu ekleme hatası:', err.message);
                                if (!responseSent) {
                                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                                    res.end('Veritabanı hatası randevu eklerken: ' + err.message);
                                    responseSent = true;
                                }
                                return;
                            }
                            console.log('Randevu başarıyla eklendi:', queryObject);

                            if (!responseSent) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Randevu başarıyla alındı!' }));
                                responseSent = true;
                            }
                        }
                    );
                });
            } catch (parseError) {
                console.error('JSON parse hatası:', parseError.message);
                if (!responseSent) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Geçersiz JSON formatı: ' + parseError.message);
                    responseSent = true;
                }
            }
        });
    } else {
        if (!responseSent) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Yol bulunamadı');
            responseSent = true;
        }
    }
});

server7.listen(1550, () => {
    console.log('Server running at http://localhost:1550/');
});


//*******************************************************************************************************

const http8 = require('http');
const url8 = require('url');

const fs8 = require('fs');


const db8 = new sqlite3.Database('mhrs.db');

const server8 = http8.createServer((req, res) => {
    responseSent = false;
    if (req.url === '/' || req.url.startsWith('/index')) {
        

        fs8.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\tıbbiRaporlar.html', 'utf8', function (err, data) {
            if (err) {
                console.error(err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Dosya okuma hatası: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            

            // CSS dosyasının içeriğini okuyoruz
            fs8.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\tıbbiRaporlar.css', 'utf8', function (err, cssData) {
                if (err) {
                    console.error(err.message);
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('CSS dosyası okuma hatası: ' + err.message);
                        responseSent = true;
                    }
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = data.replace('</head>', `<style>${cssData}</style></head>`);


                if (!responseSent) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
                    responseSent = true;
                }

                    
                });
            });
        
    }
     else if (req.url.startsWith('/raporlar')) {
        const queryObject = url8.parse(req.url, true).query;
        
        db8.get('SELECT email FROM Gecici WHERE ıd = 1', (err, row) => {
            if (err) {
                console.error('Email çekme hatası:', err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası email çekerken: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            const hastaEmail = row ? row.email : null; // Email değerini alıyoruz
           

            if (!hastaEmail) {
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası: Hasta email bulunamadı');
                    responseSent = true;
                }
                return;
            }

            db8.get('SELECT hasta_tc FROM Hasta WHERE hasta_email = ?', [hastaEmail] , (err, row) => {
                if (err) {
                    console.error('Email çekme hatası:', err.message);
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veritabanı hatası email çekerken: ' + err.message);
                        responseSent = true;
                    }
                    return;
                }
    
                const hastatc = row ? row.hasta_tc : null; // Email değerini alıyoruz
                
    
                if (!hastaEmail) {
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Veritabanı hatası: Hasta email bulunamadı');
                        responseSent = true;
                    }
                    return;
                }

        db8.get('SELECT rapor_icerik FROM Tıbbi_Rapor WHERE rapor_sahip_ıd = ?', [hastatc], (err, row) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası: ' + err.message);
                return;
            }
            if (row) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`Rapor İçeriği: ${row.rapor_icerik}`);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Hasta bulunamadı.');
            }

            });
        });
    });
}
    
    
     else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Yol bulunamadı');
    }
});

server8.listen(2550, () => {
    console.log('Server running at http://localhost:2550/');
});

//***************************************************************************

const http9 = require('http');
const url9 = require('url');

const fs9 = require('fs');


const db9 = new sqlite3.Database('mhrs.db');

const server9 = http9.createServer((req, res) => {
    responseSent = false;
    if (req.url === '/' || req.url.startsWith('/index')) {
        

        fs9.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\aktifRandevular.html', 'utf8', function (err, data) {
            if (err) {
                console.error(err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Dosya okuma hatası: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            

            // CSS dosyasının içeriğini okuyoruz
            fs9.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\gecmis.css', 'utf8', function (err, cssData) {
                if (err) {
                    console.error(err.message);
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('CSS dosyası okuma hatası: ' + err.message);
                        responseSent = true;
                    }
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = data.replace('</head>', `<style>${cssData}</style></head>`);


                if (!responseSent) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
                    responseSent = true;
                }

                    
                });
            });
        
    }
     else if (req.url.startsWith('/randevuGetir')) {
        const queryObject = url9.parse(req.url, true).query;
        
        db9.get('SELECT email FROM Gecici WHERE ıd = 1', (err, row) => {
            if (err) {
                console.error('Email çekme hatası:', err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası email çekerken: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            const hastaEmail = row ? row.email : null; // Email değerini alıyoruz
           

            if (!hastaEmail) {
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası: Hasta email bulunamadı');
                    responseSent = true;
                }
                return;
            }


        db9.get('SELECT * FROM Randevu WHERE hasta_email = ?', [hastaEmail], (err, row) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası: ' + err.message);
                return;
            }
            if (row) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`Randevu Bilgileri: ${row.hasta_email}\n${row.randevu_sehir}\n${row.randevu_ilce}\n${row.randevu_hastane}\n${row.randevu_poliklinik}\n${row.randevu_doktor_ıd}\n${row.randevu_tarih}\n${row.randevu_saat}`);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Hasta bulunamadı.');
            }

            });
        
    });
}else if (req.url.startsWith('/randevuSil')) {
    const queryObject = url9.parse(req.url, true).query;
    
    db9.get('SELECT email FROM Gecici WHERE ıd = 1', (err, row) => {
        if (err) {
            console.error('Email çekme hatası:', err.message);
            if (!responseSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Veritabanı hatası email çekerken: ' + err.message);
                responseSent = true;
            }
            return;
        }

        const hastaEmail = row ? row.email : null; // Email değerini alıyoruz
       

        if (!hastaEmail) {
            if (!responseSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Veritabanı hatası: Hasta email bulunamadı');
                responseSent = true;
            }
            return;
        }


    db9.all('SELECT * FROM Randevu WHERE hasta_email = ?', [hastaEmail], (err, rows) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Veritabanı hatası: ' + err.message);
            return;
        }
        if (rows.length > 0) {
            let responseText = 'Randevu Bilgileri:\n';
            rows.forEach((row) => {
                responseText += `${row.hasta_email}\n${row.randevu_sehir}\n${row.randevu_ilce}\n${row.randevu_hastane}\n${row.randevu_poliklinik}\n${row.randevu_doktor_ıd}\n${row.randevu_tarih}\n${row.randevu_saat}\n\n`;
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(responseText);
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Hasta bulunamadı.');
        }

        db9.get('DELETE FROM Randevu WHERE hasta_email = ?', [hastaEmail], (err, row) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Veritabanı hatası: ' + err.message);
                return;
            }
            

        });
    });
    
});
}
    
    
     else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Yol bulunamadı');
    }
});

server9.listen(4550, () => {
    console.log('Server running at http://localhost:4550/');
});

//***************************************************************************

const http10 = require('http');
const url10 = require('url');

const fs10 = require('fs');


const db10 = new sqlite3.Database('mhrs.db');

const server10 = http10.createServer((req, res) => {
    responseSent = false;
    if (req.url === '/' || req.url.startsWith('/index')) {
        

        fs10.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\gecmisRandevular.html', 'utf8', function (err, data) {
            if (err) {
                console.error(err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Dosya okuma hatası: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            

            // CSS dosyasının içeriğini okuyoruz
            fs10.readFile('C:\\Users\\cuney\\OneDrive\\Masaüstü\\ProLab-03\\JSdersleri - Kopya\\gecmis.css', 'utf8', function (err, cssData) {
                if (err) {
                    console.error(err.message);
                    if (!responseSent) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('CSS dosyası okuma hatası: ' + err.message);
                        responseSent = true;
                    }
                    return;
                }

                // CSS dosyasını da ekleyerek sonuç dosyasını oluşturuyoruz
                const finalResult = data.replace('</head>', `<style>${cssData}</style></head>`);


                if (!responseSent) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(finalResult); // HTML dosyasını ve CSS dosyasını yanıt olarak gönderiyoruz
                    responseSent = true;
                }

                    
                });
            });
        
    }
     else if (req.url.startsWith('/gecmisRandevuGetir')) {
        const queryObject = url10.parse(req.url, true).query;
        
        db10.get('SELECT email FROM Gecici WHERE ıd = 1', (err, row) => {
            if (err) {
                console.error('Email çekme hatası:', err.message);
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası email çekerken: ' + err.message);
                    responseSent = true;
                }
                return;
            }

            const hastaEmail = row ? row.email : null; // Email değerini alıyoruz
           

            if (!hastaEmail) {
                if (!responseSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Veritabanı hatası: Hasta email bulunamadı');
                    responseSent = true;
                }
                return;
            }


            db10.all('SELECT * FROM Gecmis WHERE hasta_email = ?', [hastaEmail], (err, rows) => {
                
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Veritabanı hatası: ' + err.message);
                    return;
                }
                if (rows.length > 0) {
                    let responseText = 'Randevu Bilgileri:\n';
                    rows.forEach((row) => {
                        responseText += `${row.hasta_email}\n${row.randevu_sehir}\n${row.randevu_ilce}\n${row.randevu_hastane}\n${row.randevu_poliklinik}\n${row.randevu_doktor_ıd}\n${row.randevu_tarih}\n${row.randevu_saat}\n\n`;
                        console.log(responseText);
                    });
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(responseText);
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Hasta bulunamadı.');
                }

            });
        
    });
}   
     else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Yol bulunamadı');
    }
});

server10.listen(4555, () => {
    console.log('Server running at http://localhost:4555/');
});

//***************************************************************************

const app6 = express();
const port6 = 3555;

// Body parser middleware (Express 4.16.0 ve üzeri için)
app6.use(express.urlencoded({ extended: true }));
app6.use(express.json());
app6.use(express.static('C:/Users/cuney/OneDrive/Masaüstü/ProLab-03/JSdersleri - Kopya/'));

// Open the database
let db11 = new sqlite3.Database('./mhrs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the MHRS database.');
    }
});

// Route for handling login
app6.post('/exit', (req, res) => {
    // Örnek bir SQL sorgusu, gereksinimlerinize göre değiştirin
    const sql = 'SELECT email FROM Gecici '; // Kullanıcı adı kontrolü
    const username = req.body.username; // POST verisinden kullanıcı adını al

    db11.get(sql, username, (err, row) => {
        if (err) {
            res.status(500).send('Database error: ' + err.message);
        } else if (row) {
            // User found, now delete entry from Gecici table
            const insertSql = 'DELETE FROM Gecici WHERE ıd = 1';
            db11.run(insertSql, (err) => {
                if (err) {
                    res.status(500).send('Error executing delete: ' + err.message);
                } else {
                    res.sendFile('giris.html', { root: 'C:/Users/cuney/OneDrive/Masaüstü/ProLab-03/JSdersleri - Kopya/' });
               
                    
                }
            });
        } else {
            res.status(401).send('Unauthorized: No such user');
        }
    });
});

app6.listen(port6, () => {
    console.log(`Server running on port ${port6}`);
});
