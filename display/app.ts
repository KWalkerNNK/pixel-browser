import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import connect from './config/connect';
import { Connection } from 'mysql2/promise';

const app = express();
const port: number = 1410;

const final: Promise<Connection | undefined> = connect;

app.use(express.static(path.join(__dirname, 'views')));

app.use(morgan('combined'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/history', async (req, res) => {
    async function connect() {
        try {
            if (final) {
                const [rows] = await final.then((e: any) =>
                    e.execute('SELECT * FROM browserhistory.cache'),
                );
                return await rows;
            }
            else {
                console.log('Lỗi truy vấn!')
            }
        }
        catch (e) {
            console.log('Lỗi kết nối', e);
        }
    }
    let rows = connect();
    rows.then(function (target) {
        res.render('index', { target });
    });

});

app.get('/delete/:id', async (req, res) => {
    let par = req.params.id;
    async function connect() {
        try {
            if (final) {
                const [rows] = await final.then((e: any) =>
                    e.execute(`DELETE FROM cache WHERE id=${par}`),
                );
                return await rows;
            }
            else {
                console.log('Lỗi truy vấn!')
            }
        } catch (e) {
            console.log('Lỗi kết nối', e);
        }
    }
    let rows = connect();
    rows.then(function (target) {
        res.redirect('/history');
    });
});

app.get('/delete-all', async (req, res) => {
    async function connect() {
        try {
            if (final) {
                const [rows] = await final.then((e: any) =>
                    e.execute(`DELETE FROM cache`),
                );
                return await rows;
            }
            else {
                console.log('Lỗi truy vấn!')
            }
        } catch (e) {
            console.log('Lỗi kết nối', e);
        }
    }
    let rows = connect();
    rows.then(function (target) {
        res.redirect('/history');
    });
});

app.get('/home', async (req, res) => {
    return res.render('home', { home: true });
});


app.listen(port, () => {
    console.log(`Đang lắng nghe cổng ${port}`);
});
