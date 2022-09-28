const express = require('express')
const sql = require('mssql')
const router = express.Router()
const { request } = require('../database')

async function showWpis(req, res) {
  let wpis = []

  if (!req.session || !req.session.userLogin) {
    res.redirect('/main')
    return;
  }

  try {
    const dbRequest = await request()
    let result;

    if (req.query.kategoria) {
      result = await dbRequest
        .input('Kategoria', sql.VarChar(50), req.query.kategoria)
        .query('SELECT * FROM Wpis WHERE Kategoria = @Kategoria')
    } else {
      result = await dbRequest.query('SELECT * FROM Wpis')
    }

    wpis = result.recordset
  } catch (err) {
    console.error('Nie udało się pobrać wpisów', err)
  }

  res.render('index', { title: 'Lista wpisów', wpis: wpis, message: res.message, kategoria: req.query.kategoria })
}

async function showNewProductForm(req, res) {
  res.render('new-product', { title: 'Nowy Wpis' })
}

async function addNewProduct(req, res, next) {
  try {
    const dbRequest = await request()
    await dbRequest
      .input('Miejsce', sql.VarChar(50), req.body.miejsce)
      .input('Miasto', sql.VarChar(50), req.body.miasto)
      .input('Opis', sql.VarChar(1000), req.body.opis)
      .input('Koordynaty', sql.VarChar(50), req.body.koordynaty)
      .input('KrajPochodzenia', sql.VarChar(30), req.body.krajpochodzenia)
      .input('Kategoria', sql.VarChar(50), req.body.kategoria)
      .input('DataDodania', sql.VarChar(50), req.body.datadodania)
      .input('LinkZdjecia', sql.VarChar(50), req.body.linkzdjecia)
      .query('INSERT INTO Wpis VALUES (@Miejsce, @Miasto, @Opis, @Koordynaty, @KrajPochodzenia, @Kategoria, @DataDodania, @LinkZdjecia)')

    res.message = 'Dodano nowy wpis'
  } catch (err) {
    console.error('Nie udało się dodać wpisu', err)
  }

  showProducts(req, res)
}

async function deleteProduct(req, res) {

  try {
    const dbRequest = await request()

    await dbRequest
      .input('Id', sql.INT, req.params.id)
      .query('DELETE FROM Wpis WHERE Id = @Id')
  } catch (err) {
    console.error('Nie udało się usunąć wpisu', err)
  }

  res.message = `Usunięto wpis o id ${req.params.id}`;

  showProducts(req, res)
}

async function moreWpis(req, res) {
  res.render('more', { title: 'Więcej Informacji' })
}

async function showLoginForm(req, res) {
  res.render('login', { title: 'Logowanie' })
}

async function login(req, res) {
  const {login, password} = req.body;

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Login', sql.VarChar(50), login)
      .input('Haslo', sql.VarChar(50), password)
      .query('SELECT Login FROM Uzytkownik WHERE Login = @Login AND Haslo = @Haslo')
  
    if (result.rowsAffected[0] === 1) {
      req.session.userLogin = login;
      showWpis(req, res);
    } else {
      res.render('login', {title: 'Logownie', error: 'Logowanie nieudane'})
    }
  } catch (err) {
    res.render('login', {title: 'Logownie', error: 'Logowanie nieudane'})
  }

}

async function showRegisterForm(req, res) {
  res.render('register', { title: 'Rejestracja' })
}

async function register(req, res) {
  const {imie, nazwisko, login, haslo, email} = req.body;

  try {
    const dbRequest = await request()

    const result = await dbRequest
      .input('Imie', sql.VarChar(50), imie)
      .input('Nazwisko', sql.VarChar(50), nazwisko)
      .input('Login', sql.VarChar(50), login)
      .input('Haslo', sql.VarChar(50), haslo)
      .input('Email', sql.VarChar(50), email)
      .query('INSERT INTO Uzytkownik VALUES (DEFAULT, @Imie, @Nazwisko, @Login, @Haslo, @Email)')
  
    if (result.rowsAffected[0] === 1) {
      req.session.userLogin = login;
      showWpis(req, res);
    }
  } catch (err) {
    res.render('register', {title: 'Rejestracja', error: 'Rejestracja nieudana'})
  }

}

async function main(req, res) {
  res.render('main', { title: 'Strona Główna' })
}


router.get('/', showWpis);
router.get('/new-wpis', showNewProductForm);
router.post('/new-wpis', addNewProduct);
router.post('/wpis/:id/delete', deleteProduct);
router.post('/wiecej/:id', moreWpis);
router.get('/login', showLoginForm);
router.post('/login', login);
router.get('/register', showRegisterForm);
router.post('/register', register);
router.get('/main', main);

module.exports = router;
