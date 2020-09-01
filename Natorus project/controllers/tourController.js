const fs = require('fs')
const toursData = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/* ----------------------- Middleware -----------------------*/

exports.checkID = (req, res, next, val) => {
  if(req.params.id*1 >toursData.length) {
    return res.status(404).json( {
      status: 'fail',
      message: 'inavlid id'
    })
  }

  next();
};

exports.checkBody = (req, res, next, val) => {
  if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: "missing name or price"
    })
  }
  next();
};

/* ----------------------- HTTP functions -----------------------*/

exports.getAllTours = (req, res) => {
    console.log(req.reuestTime)
    res.status(200).json({
      status: 'success',
      requestedAt: req.reuestTime,
      results: toursData.length,
      data: {
        tours: toursData
      }
    });
  };
  
  exports.getOneTour = (req, res) => {
  
    console.log(req.params)   // will output parameters in url
    const id = req.params.id * 1;  // converts string into nmumber
  
    if(id >toursData.length) {
      return req.status(404).json( {
        status: 'fail',
        message: 'inavlid id'
      })
    }
    const tour = toursData.find(el => el.id === id)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  };
  
  
  exports.createTour = (req,res) => {
    
    const newId = toursData[toursData.length -1].id+1;
    const newTour = Object.assign({id: newId}, req.body);
  
    toursData.push(newTour);
  
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(toursData),
      err => {
      res.send(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
    );
  
  }
  
  
  exports.UpdateTour = (req, res) => {
   
  
    res.status(200).json({
      status: 'sucess',
      data: {
        tour: '<updated tour here...>'
      }
    })
  }
  
  exports.deleteTour = (req, res) => {
   
  
    res.status(204).json({
      status: 'sucess',
      data: null
    })
  }
  