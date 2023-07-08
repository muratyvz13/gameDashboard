const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const prisma = new PrismaClient();
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// POST isteği için route
app.post('/dashboard', async (req, res) => {
  const { walletAddress, score } = req.body;

  try {
    let existingData = await prisma.dashboardTable.findUnique({
      where: {
        walletAddress,
      },
    });

    if (existingData) {
      // Eğer walletAddress mevcut ise, mevcut veriyi güncelle
      existingData = await prisma.dashboardTable.update({
        where: {
          id: existingData.id,
        },
        data: {
          score: parseInt(score),
        },
      });

      res.status(200).json({ message: 'Veri güncellendi', data: existingData });
    } else {
      // Eğer walletAddress mevcut değilse, yeni veri ekle
      const newData = await prisma.dashboardTable.create({
        data: {
          walletAddress,
          score: parseInt(score),
        },
      });

      res.status(201).json({ message: 'Yeni veri eklendi', data: newData });
    }
  } catch (error) {
    console.error('Veri işleme hatası:', error);
    res.status(500).json({ message: 'Veri işleme hatası' });
  }
});

app.get('/getdashboard', async (req, res) => {
  try {
    const dashboardData = await prisma.dashboardTable.findMany({
      select: {
        walletAddress: true,
        score: true
      }
    });
    res.json(dashboardData);
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


// Sunucuyu dinle
app.listen(3000, () => {
  console.log('Sunucu çalışıyor...');
});
