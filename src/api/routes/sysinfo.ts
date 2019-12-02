'use strict';

import { Router, Request, Response } from 'express';

import * as eRBAC from 'easy-rbac';
import * as si from 'systeminformation';

const router = Router();

router.get('/api/sysinfo/static', (req: Request, res: Response) => {
  Promise.all([
    si.system(),
    si.cpu(),
    si.cpuFlags()
  ]).then(data => {
    res.status(200).json({
      system: data[0],
      cpi: data[1],
      cpuFlags: data[2]
    });
  }).catch(error => console.error(error));
});


router.get('/api/sysinfo/cpu', (req: Request, res: Response) => {
  Promise.all([
    si.currentLoad(),
    si.fullLoad(),
    si.cpuCurrentspeed(),
    si.cpuTemperature()
  ]).then(data => {
    res.status(200).json({
      currentLoad: data[0],
      fullLoad: data[1],
      cpuCurrentspeed: data[2],
      cpuTemperature: data[3]
    });
  }).catch(error => console.error(error));
});

router.get('/api/sysinfo/network', (req: Request, res: Response) => {
  Promise.all([
    si.networkInterfaces()
  ]).then(data => {
    res.status(200).json({
      networkInterfaces: data[0]
    });
  }).catch(error => console.error(error));
});

router.get('/api/sysinfo/memory', (req: Request, res: Response) => {
  Promise.all([
    si.mem()
  ]).then(data => {
    res.status(200).json({
      mem: data[0]
    });
  }).catch(error => console.error(error));
});

router.get('/api/sysinfo/disk', (req: Request, res: Response) => {
  Promise.all([
    si.fsSize()
  ]).then(data => {
    res.status(200).json({
      fsSize: data[0]
    });
  }).catch(error => console.error(error));
});

router.get('/api/sysinfo/processes', (req: Request, res: Response) => {
  Promise.all([
    si.processes(),
    si.services('*')
  ]).then(data => {
    res.status(200).json({
      processes: data[0],
      services: data[1]
    });
  }).catch(error => console.error(error));
});



router.get('/api/sysinfo/wifi', (req: Request, res: Response) => {
  Promise.all([
    si.wifiNetworks
  ]).then(data => {
    res.status(200).json({
      wifi: data[0]
    });
  }).catch(error => console.error(error));
});


router.get('/api/sysinfo/all', (req: Request, res: Response) => {
  Promise.all([
    si.getStaticData(),
    si.getDynamicData('', '')
  ]).then(data => {
    res.status(200).json({
      static: data[0],
      dynamic: data[1]
    });
  }).catch(error => console.error(error));
});

export = router;
