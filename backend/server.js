const express = require('express');
const app = express();
const PORT = 7000;
//const path = require('path')
const multer = require("multer");

const cors = require('cors')
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.use(express.json());
//app.use(express.json ());
const jwt = require("jsonwebtoken")
const authJWT = require("./middleware")
app.use(express.json());
app.get('/alamat-baru', (req, res) => {
    res.send(`Tanjung Perak Tepi Laut <br><a href='/perkenalan'>kenalan dulu</a>`)
})
app.get('/perkenalan', (req, res) => {
    res.send('nama saya fajar')
})



const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_babershop_fajar'
})
db.connect(err => {
    if (err) {
        console.error('GAGAL KONEKSI KE DATABASE:', err)
    } else {
        console.log('Berhasill terkonekk anjayyyy')
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique);
    }
});

const upload = multer({ storage });

//route untuk select pengguna
app.get('/pengguna', (req, res) => {
    const sql = 'SELECT * FROM pengguna';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json(results)
    })
})

//route untuk insert pengguna
const bcrypt = require('bcrypt')
const sR = 10
app.post('/pengguna', async (req, res) => {
    const { nama_pengguna, email, password, role } = req.body
    try {
        const tempPass = await bcrypt.hash(password, sR)
        const sql = 'INSERT INTO pengguna (nama_pengguna, email, password, role) VALUES (?, ?, ?, ?)'
        db.query(sql, [nama_pengguna, email, tempPass, role], (err, results) => {
            if (err) return res.status(500).json({ error: err.sqlMessage })
            res.json({
                message: 'Pengguna berhasil ditambahkan!',
                id_pengguna: results.insertId
            })
        })
    } catch (err) {
        res.status(500).json({ error: 'Gagal hashing password' })
    }
})

//route untuk update pengguna
app.put('/pengguna/:id_pengguna', async (req, res) => {
    const { id_pengguna } = req.params
    const { nama_pengguna, email, password, role } = req.body
    try {
        let sql, values
        if (password) {
            const tempPass = await bcrypt.hash(password, sR)
            sql = 'UPDATE pengguna SET nama_pengguna = ?, email = ?, password = ?, role = ? WHERE id_pengguna = ?'
            values = [nama_pengguna, email, tempPass, role, id_pengguna]
        } else {
            sql = 'UPDATE pengguna SET nama_pengguna = ?, email =?, password = ?, role = ? WHERE id_pengguna = ?'
            values = [nama_pengguna, email, role, id_pengguna]
        }
        db.query(sql, values, (err, results) => {
            if (err) return res.status(500).json({ error: err.sqlMessage })
            res.json({ message: 'Pengguna berhasil diupdate!' })
        })
    } catch (err) {
        res.status(500).json({ error: 'Gagal hashing password ' })
    }
})

//rout untuk menghapus pengguna
app.delete('/pengguna/:id_pengguna', (req, res) => {
    const { id_pengguna } = req.params
    const sql = 'DELETE FROM pengguna WHERE id_pengguna = ?'
    db.query(sql, [id_pengguna], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json({ message: 'Pengguna berhasil dihapus!' })
    })
})

//get pengguna berdasarkan id_pengguna
app.get('/pengguna/:id_pengguna', (req, res) => {
    const { id_pengguna } = req.params
    const sql = 'SELECT * FROM pengguna WHERE id_pengguna = ?'
    db.query(sql, [id_pengguna], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json(results)
    })
})



app.post('/login', (req, res) => {
    const { email, password } = req.body
    const sql = "SELECT * FROM pengguna WHERE email = ?"
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        if (result.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }
        const user = result[0]
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Password salah' })
        }
        const token = jwt.sign({ id: user.id_pengguna }, 'inirahasia', { expiresIn: 86400 })
        res.status(200).json({
            auth: true, token, id_pengguna: user.id_pengguna

        })
    })
})

// LOGIN PELANGGAN — versi FIX
app.post('/loginpelanggan', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM pelanggan WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        if (result.length === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
        }

        const pelanggan = result[0];

        const passwordIsValid = bcrypt.compareSync(password, pelanggan.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: pelanggan.id_pelanggan },
            "inirahasia",
            { expiresIn: 86400 }
        );

        // **INI DATA LENGKAP YANG HARUS DIKIRIM**
        res.status(200).json({
            auth: true,
            token,
            pelanggan: {
                id_pelanggan: pelanggan.id_pelanggan,
                nama_pelanggan: pelanggan.nama_pelanggan,
                username: pelanggan.username,
                email: pelanggan.email,
                no_hp: pelanggan.no_hp
            }
        });
    });
});


//route untuk select paket
app.get("/paket/:id", (req, res) => {
    const sql = "SELECT * FROM paket WHERE id_paket = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(result[0]);
    });
});


//route untuk insert paket
app.post("/paket", upload.single("gambar"), (req, res) => {
    try {
        const { nama_paket } = req.body;
        const gambar = req.file ? req.file.filename : null;

        const sql = "INSERT INTO paket (nama_paket, image) VALUES (?, ?)";
        db.query(sql, [nama_paket, gambar], (err, result) => {
            if (err) {
                console.log("SQL ERROR:", err);
                return res.status(500).json({ error: err.sqlMessage });
            }

            res.json({
                message: "Paket berhasil ditambahkan!",
                id_paket: result.insertId
            });
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//rout untuk update paket
app.put("/paket/:id", upload.single("gambar"), (req, res) => {
    const { nama_paket } = req.body;
    const image = req.file ? req.file.filename : req.body.gambar_lama;

    const sql = `
        UPDATE paket 
        SET nama_paket = ?, image = ?
        WHERE id_paket = ?
    `;

    db.query(sql, [nama_paket, image, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: "Paket berhasil diupdate!" });
    });
});


//rout untuk menghapus paket
app.delete('/paket/:id_paket', (req, res) => {
    const { id_paket } = req.params
    const sql = 'DELETE FROM paket WHERE id_paket = ?'
    db.query(sql, [id_paket], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json({ message: 'Paket berhasil dihapus!' })
    })
})
app.get('/paket', (req, res) => {
    db.query("SELECT id_paket, nama_paket, image FROM paket", 
    (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


//route untuk select pegawai
app.get('/pegawai', (req, res) => {
    const sql = 'SELECT * FROM pegawai';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});

//route untuk insert pegawai
app.post('/pegawai', async (req, res) => {
    const { nama_pegawai, no_hp } = req.body;
    try {
        const sql = 'INSERT INTO pegawai (nama_pegawai, no_hp) VALUES(?, ?)';
        db.query(sql, [nama_pegawai, no_hp], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: 'Pegawai berhasil ditambahkan!',
                id_pegawai: result.insertId
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menambahkan pegawai' });
    }
});

//route untuk update pegawai
app.put('/pegawai/:id_pegawai', async (req, res) => {
    const { id_pegawai } = req.params;
    const { nama_pegawai, no_hp } = req.body;
    try {
        const sql = 'UPDATE pegawai SET nama_pegawai=?, no_hp=? WHERE id_pegawai=?';
        const values = [nama_pegawai, no_hp, id_pegawai];
        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ message: 'Pegawai berhasil diupdate!' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update pegawai' });
    }
});

//route untuk menghapus pegawai
app.delete('/pegawai/:id_pegawai', (req, res) => {
    const { id_pegawai } = req.params;
    const sql = 'DELETE FROM pegawai WHERE id_pegawai = ?';
    db.query(sql, [id_pegawai], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'Pegawai berhasil dihapus!' });
    });
});

//get pegawai berdasarkan id
app.get('/pegawai/:id_pegawai', (req, res) => {
    const { id_pegawai } = req.params;
    const sql = 'SELECT * FROM pegawai WHERE id_pegawai = ?';
    db.query(sql, [id_pegawai], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});


//pelanggan
app.post('/pelanggan/register', (req, res) => {
    const { nama_pelanggan, username, email, password, no_hp } = req.body;

    if (!nama_pelanggan || !username || !email || !password || !no_hp) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const checkSql = "SELECT * FROM pelanggan WHERE email = ?";
    db.query(checkSql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        if (result.length > 0) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertSql = `
            INSERT INTO pelanggan (nama_pelanggan, username, email, password, no_hp) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [nama_pelanggan, username, email, hashedPassword, no_hp],
            (err2, result2) => {
                if (err2) return res.status(500).json({ error: err2.sqlMessage });

                return res.status(201).json({
                    message: "Registrasi berhasil",
                    id_pelanggan: result2.insertId
                });
            }
        );
    });
});


// ================================
// CRUD UNTUK DATA PELANGGAN
// ================================

// GET semua pelanggan
app.get("/pelanggan", (req, res) => {
  const q = "SELECT * FROM pelanggan ORDER BY id_pelanggan DESC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil pelanggan" });
    return res.json(data);
  });
});

// Tambah pelanggan
app.post("/pelanggan", (req, res) => {
    const { nama_pelanggan, username, email, password, no_hp } = req.body;

    // Hash password pelanggan
    const hashedPassword = bcrypt.hashSync(password, 10);

    const q = `
        INSERT INTO pelanggan 
        (nama_pelanggan, username, email, password, no_hp) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        q,
        [nama_pelanggan, username, email, hashedPassword, no_hp ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Gagal menambah pelanggan" });
            }
            return res.json({ message: "Pelanggan berhasil ditambahkan" });
        }
    );
});

// GET detail pelanggan by ID (untuk edit)
app.get("/pelanggan/:id", (req, res) => {
  const id = req.params.id;

  const q = "SELECT * FROM pelanggan WHERE id_pelanggan = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data" });
    if (data.length === 0) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });

    return res.json(data[0]);
  });
});

// Update pelanggan
app.put("/pelanggan/:id", (req, res) => {
  const id = req.params.id;
  const { nama_pelanggan, username, email, password, no_hp } = req.body;

  const q = `
        UPDATE pelanggan SET 
        nama_pelanggan = ?, 
        username = ?, 
        email = ?, 
        password = ?, 
        no_hp = ? 
        WHERE id_pelanggan = ?
    `;

  db.query(
    q,
    [nama_pelanggan, username, email, password, no_hp, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal mengupdate data pelanggan" });

      return res.json({ message: "Pelanggan berhasil diupdate" });
    }
  );
});

// Hapus pelanggan
app.delete("/pelanggan/:id", (req, res) => {
  const id = req.params.id;

  const q = "DELETE FROM pelanggan WHERE id_pelanggan = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus pelanggan" });

    return res.json({ message: "Pelanggan berhasil dihapus" });
  });
});

app.get("/layanan", (req, res) => {
    const sql = `
        SELECT 
            l.id_layanan,
            l.nama_layanan,
            l.harga,
            p.nama_paket
        FROM layanan l
        LEFT JOIN paket p ON l.id_paket = p.id_paket
        ORDER BY l.id_layanan DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});


// =======================
// GET layanan berdasarkan id_paket
// =======================
app.get("/layanan/paket/:id_paket", (req, res) => {
    db.query(
        "SELECT * FROM layanan WHERE id_paket = ?",
        [req.params.id_paket],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
});


app.post("/layanan", (req, res) => {
    const { nama_layanan, harga, id_paket } = req.body;

    const sql = `
        INSERT INTO layanan (nama_layanan, harga, id_paket)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nama_layanan, harga, id_paket], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        res.json({ message: "Layanan berhasil ditambahkan!" });
    });
});

// =======================
// DELETE layanan
// =======================
app.delete("/layanan/:id_layanan", (req, res) => {
    const { id_layanan } = req.params;

    const sql = "DELETE FROM layanan WHERE id_layanan = ?";

    db.query(sql, [id_layanan], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Layanan tidak ditemukan" });
        }

        res.json({ message: "Layanan berhasil dihapus!" });
    });
});
// ---------------------------
// GET semua transaksi
// ---------------------------
app.get("/transaksi", (req, res) => {
    const sql = `
        SELECT 
            t.id_trans,
            t.tgl_trans,
            pl.nama_pelanggan,
            p.nama_paket,
            l.nama_layanan,
            pg.nama_pegawai
        FROM transaksi t
        LEFT JOIN pelanggan pl ON t.id_pelanggan = pl.id_pelanggan
        LEFT JOIN paket p ON t.id_paket = p.id_paket
        LEFT JOIN layanan l ON t.id_layanan = l.id_layanan
        LEFT JOIN pegawai pg ON t.id_pegawai = pg.id_pegawai
        ORDER BY t.id_trans DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});


// ---------------------------
// GET detail transaksi by ID (STRUK)
// ---------------------------
app.get("/transaksi/:id_trans", (req, res) => {
    const { id_trans } = req.params;

    const sql = `
        SELECT 
            t.id_trans,
            t.tgl_trans,
            pl.nama_pelanggan,
            pl.no_hp,
            p.nama_paket,
            l.nama_layanan,
            l.harga,
            pg.nama_pegawai
        FROM transaksi t
        LEFT JOIN pelanggan pl ON t.id_pelanggan = pl.id_pelanggan
        LEFT JOIN paket p ON t.id_paket = p.id_paket
        LEFT JOIN pegawai pg ON t.id_pegawai = pg.id_pegawai
        LEFT JOIN layanan l ON t.id_layanan = l.id_layanan
        WHERE t.id_trans = ?
    `;

    db.query(sql, [id_trans], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        if (result.length === 0)
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });

        res.json(result[0]);
    });
});


// ---------------------------
// INSERT TRANSAKSI dari BOOKING
// ---------------------------
app.post("/transaksi/booking", (req, res) => {
    const { id_pelanggan, id_paket, id_layanan, tanggal } = req.body;

    console.log("DATA DITERIMA BACKEND:", req.body);

    if (!id_pelanggan || !id_paket || !id_layanan || !tanggal) {
        return res
            .status(400)
            .json({ message: "Data tidak lengkap dari frontend" });
    }

    // Pilih pegawai random
    const sqlPegawai = "SELECT id_pegawai FROM pegawai ORDER BY RAND() LIMIT 1";

    db.query(sqlPegawai, (err, pegawai) => {
        if (err || pegawai.length === 0) {
            return res.status(500).json({ message: "Gagal memilih pegawai" });
        }

        const idPegawai = pegawai[0].id_pegawai;

        const sql = `
            INSERT INTO transaksi (tgl_trans, id_pelanggan, id_paket, id_layanan, id_pegawai)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [tanggal, id_pelanggan, id_paket, id_layanan, idPegawai],
            (err, result) => {
                if (err) {
                    console.log("SQL ERROR:", err.sqlMessage);
                    return res.status(500).json({ message: "Gagal menyimpan transaksi" });
                }

                res.json({
                    message: "Transaksi berhasil dibuat!",
                    id_trans: result.insertId,
                    id_pegawai: idPegawai
                });
            }
        );
    });
});


// ---------------------------
// GET transaksi berdasarkan id_pelanggan
// ---------------------------
app.get("/transaksi/pelanggan/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            t.id_trans,
            t.tgl_trans,
            p.nama_paket,
            l.nama_layanan,
            l.harga
        FROM transaksi t
        LEFT JOIN paket p ON t.id_paket = p.id_paket
        LEFT JOIN layanan l ON t.id_layanan = l.id_layanan
        WHERE t.id_pelanggan = ?
        ORDER BY t.id_trans DESC
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});


// ---------------------------
// DELETE TRANSAKSI
// ---------------------------
app.delete("/transaksi/:id_trans", (req, res) => {
    const { id_trans } = req.params;

    const sql = "DELETE FROM transaksi WHERE id_trans = ?";

    db.query(sql, [id_trans], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }

        res.json({ message: "Transaksi berhasil dihapus!" });
    });
});

// PALING BAWAH BARU INI !!!
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
