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
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
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
app.get('/paket', (req, res) => {
    const sql = 'SELECT * FROM paket';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json(results)
    })
})

//route untuk insert paket
app.post('/paket', async (req, res) => {
    const { nama_paket, harga } = req.body;
    try {
        const sql = 'INSERT INTO paket (nama_paket, harga) VALUES(?, ?)';
        db.query(sql, [nama_paket, harga], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: 'paket berhasil ditambahkan!',
                id_paket: result.insertId
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'gagal menambahkan paket' });
    }
});

//rout untuk update paket
app.put('/paket/:id_paket', async (req, res) => {
    const { id_paket  } = req.params;
    const { nama_paket, harga } = req.body;
    try {
        const sql = 'UPDATE paket SET nama_paket=?, harga=? WHERE id_paket=?';
        const values = [nama_paket, harga, id_paket];
        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ message: 'paket berhasil diupdate' });
        });
    } catch (err) {
        res.status(500).json({ error: 'gagal update paket' });
    }
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

//get pengguna berdasarkan id_paket
app.get('/paket/:id_paket', (req, res) => {
    const { id_paket } = req.params
    const sql = 'SELECT * FROM paket WHERE id_paket = ?'
    db.query(sql, [id_paket], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage })
        res.json(results)
    })
})

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

// ---------------------------
// GET semua transaksi
// ---------------------------
app.get("/transaksi", (req, res) => {
  const sql = `
    SELECT 
      t.id_trans, 
      t.tgl_trans, 
      t.id_pelanggan,
      pl.nama_pelanggan AS nama_pelanggan,
      t.id_paket,
      p.nama_paket,
      p.harga,
      t.id_pegawai,
      g.nama_pegawai,
      t.id_pengguna
    FROM transaksi t
    LEFT JOIN paket p ON t.id_paket = p.id_paket
    LEFT JOIN pegawai g ON t.id_pegawai = g.id_pegawai
    LEFT JOIN pelanggan pl ON t.id_pelanggan = pl.id_pelanggan
    ORDER BY t.id_trans DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});



// ---------------------------
// GET detail transaksi by ID (UNTUK STRUK)
// ---------------------------
app.get("/transaksi/:id_trans", (req, res) => {
  const { id_trans } = req.params;

  const sql = `
    SELECT 
      t.id_trans, 
      t.tgl_trans,
      t.id_pelanggan,
      pl.nama_pelanggan,
      t.id_paket,
      p.nama_paket,
      p.harga,
      t.id_pegawai,
      g.nama_pegawai,
      t.id_pengguna
    FROM transaksi t
    LEFT JOIN paket p ON t.id_paket = p.id_paket
    LEFT JOIN pegawai g ON t.id_pegawai = g.id_pegawai
    LEFT JOIN pelanggan pl ON t.id_pelanggan = pl.id_pelanggan
    WHERE t.id_trans = ?
  `;

  db.query(sql, [id_trans], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.length === 0) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json(result[0]);
  });
});

// =======================
// CARI ID PELANGGAN BY NAMA
// =======================
function findPelangganIdByName(nama, callback) {
    if (!nama) return callback(null, null);

    const sql = "SELECT id_pelanggan FROM pelanggan WHERE nama_pelanggan = ?";
    db.query(sql, [nama], (err, result) => {
        if (err) return callback(err, null);

        if (result.length > 0) {
            callback(null, result[0].id_pelanggan);
        } else {
            callback(null, null); // jika nama tidak ditemukan
        }
    });
}

// =======================
// TAMBAH TRANSAKSI
// =======================
app.post("/transaksi", (req, res) => {
    const { tgl_trans, nama_pelanggan, id_paket, id_pegawai, id_pengguna } = req.body;

    // 1️⃣ Cari ID pelanggan berdasarkan nama
    const sqlFindPelanggan = `SELECT id_pelanggan FROM pelanggan WHERE nama_pelanggan = ?`;

    db.query(sqlFindPelanggan, [nama_pelanggan], (err, hasilPelanggan) => {
        if (err) {
            console.log("Error cari pelanggan:", err);
            return res.status(500).json({ message: "Error mencari pelanggan" });
        }

        if (hasilPelanggan.length === 0) {
            return res.status(400).json({ message: "Nama pelanggan tidak ditemukan" });
        }

        const idPelanggan = hasilPelanggan[0].id_pelanggan;

        // 2️⃣ Insert transaksi
        const sqlInsert = `
            INSERT INTO transaksi (tgl_trans, id_pelanggan, id_paket, id_pegawai, id_pengguna)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            tgl_trans,
            idPelanggan,
            id_paket,
            id_pegawai,
            id_pengguna
        ];

        db.query(sqlInsert, values, (errInsert, hasilInsert) => {
            if (errInsert) {
                console.log("Error insert transaksi:", errInsert.sqlMessage);
                return res.status(500).json({ message: "Gagal menyimpan transaksi" });
            }

            res.json({ message: "Transaksi berhasil disimpan", id: hasilInsert.insertId });
        });
    });
});




// ---------------------------
// UPDATE transaksi
// (mirip logic: prefer id_pelanggan, fallback cek nama_pelanggan)
// ---------------------------
app.put("/transaksi/:id_trans", (req, res) => {
  const { id_trans } = req.params;
  const { tgl_trans, id_pelanggan, nama_pelanggan, id_paket, id_pegawai, id_pengguna } = req.body;

  const doUpdate = (finalIdPelanggan) => {
    const sql = `
      UPDATE transaksi 
      SET tgl_trans = ?, id_pelanggan = ?, id_paket = ?, id_pegawai = ?, id_pengguna = ?
      WHERE id_trans = ?
    `;
    db.query(sql, [tgl_trans || null, finalIdPelanggan, id_paket || null, id_pegawai || null, id_pengguna || null, id_trans], (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "Transaksi berhasil diupdate!" });
    });
  };

  if (id_pelanggan) {
    return doUpdate(id_pelanggan);
  }

  findPelangganIdByName(nama_pelanggan, (errFind, foundId) => {
    if (errFind) return res.status(500).json({ error: errFind.sqlMessage || errFind.message });
    doUpdate(foundId);
  });
});

// ---------------------------
// DELETE transaksi
// ---------------------------
app.delete("/transaksi/:id_trans", (req, res) => {
  const { id_trans } = req.params;
  const sql = "DELETE FROM transaksi WHERE id_trans = ?";
  db.query(sql, [id_trans], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "Transaksi berhasil dihapus!" });
  });
});

//pelanggan
app.post('/pelanggan/register', (req, res) => {
    const { nama_pelanggan, email, password, no_hp } = req.body;

    if (!nama_pelanggan || !email || !password || !no_hp) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek apakah email sudah digunakan
    const checkSql = "SELECT * FROM pelanggan WHERE email = ?";
    db.query(checkSql, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        if (result.length > 0) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SQL INSERT
        const insertSql = `
            INSERT INTO pelanggan (nama_pelanggan, email, password, no_hp) 
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [nama_pelanggan, email, hashedPassword, no_hp],
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
    const sql = "SELECT * FROM layanan ORDER BY id_layanan DESC";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(result);
    });
});

// =======================
// GET layanan berdasarkan id_paket
// =======================
app.get("/layanan/paket/:id_paket", (req, res) => {
    const { id_paket } = req.params;

    const sql = `
        SELECT *
        FROM layanan
        WHERE id_paket = ?
    `;

    db.query(sql, [id_paket], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});
// ================================
// GET transaksi berdasarkan id_pelanggan
// ================================
app.get("/transaksi/pelanggan/:id_pelanggan", (req, res) => {
    const { id_pelanggan } = req.params;

    const sql = `
        SELECT 
            t.id_trans,
            t.tgl_trans,
            p.nama_paket,
            p.harga,
            g.nama_pegawai
        FROM transaksi t
        LEFT JOIN paket p ON t.id_paket = p.id_paket
        LEFT JOIN pegawai g ON t.id_pegawai = g.id_pegawai
        WHERE t.id_pelanggan = ?
        ORDER BY t.id_trans DESC
    `;

    db.query(sql, [id_pelanggan], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(results);
    });
});
