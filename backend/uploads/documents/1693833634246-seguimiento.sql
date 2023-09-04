CREATE TABLE IF NOT EXISTS `etapa_proyecto` (
  `id_etapa_proyecto` INT NOT null AUTO_INCREMENT,
  `fecha_seguimiento` DATE NOT NULL,
  `fuente_de_informacion` VARCHAR(250) NOT NULL,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `id_etapa` INT,
  `id_proyecto` INT,
  `id_entidad_ejecutora` INT,
  PRIMARY KEY (`id_etapa_proyecto`),
  FOREIGN KEY (`id_etapa`) REFERENCES `etapa` (`id_etapa`),
  FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`),
  FOREIGN KEY (`id_entidad_ejecutora`) REFERENCES `entidad_ejecutora` (`id_entidad_ejecutora`)
);



CREATE TABLE IF NOT EXISTS `seguimiento_fisico`(
	`id_seguimiento_fisico` INT NOT NULL AUTO_INCREMENT,
	`avance_seguimiento_fisico` INT NOT NULL,
	`fecha_seguimiento_fisico` DATE NOT NULL,
	`comentario` VARCHAR(255) NOT NULL,
	`id_etapa_proyecto` INT NOT NULL,
	PRIMARY KEY (`id_seguimiento_fisico`),
	FOREIGN KEY (`id_etapa_proyecto`) REFERENCES `etapa_proyecto`(`id_etapa_proyecto`)
);

CREATE TABLE IF NOT EXISTS `financiamiento`(
	`id_financiamiento` INT NOT NULL AUTO_INCREMENT,
	`costo_inicial` FLOAT NOT NULL,
	`costo_final` FLOAT NOT NULL,
	`fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`id_entidad_financiera` INT NOT NULL,
	`id_etapa_proyecto` INT NOT NULL,
	PRIMARY KEY(`id_financiamiento`),
	FOREIGN KEY(`id_entidad_financiera`) REFERENCES `entidad_financiera`(`id_entidad_financiera`),
	FOREIGN KEY(`id_etapa_proyecto`) REFERENCES `etapa_proyecto`(`id_etapa_proyecto`)
);

CREATE TABLE IF NOT EXISTS `seguimiento_financiero`(
	`id_seguimiento_financiero` INT NOT NULL AUTO_INCREMENT,
	`monto` VARCHAR(25) NOT NULL,
	`fecha_seguimiento` DATE NOT NULL,
	`comentario` VARCHAR(500) NOT NULL,
	`id_financiamiento` INT,
	PRIMARY KEY (`id_seguimiento_financiero`),
	FOREIGN KEY (`id_financiamiento`) REFERENCES `financiamiento`(`id_financiamiento`)
);
INSERT INTO `fuente_de_informacion` (`nom_fuente_inf`,`desc_fuente_inf`)
VALUES ('FUENTE 1','DESCRIPCION 1'),('FUENTE 2','DESCRIPCION 2'),('FUENTE 3','DESCRIPCION 3');
SELECT 
  P.id_proyecto,P.nom_proyecto, P.id_tipologia,
  TIP.nom_tipologia AS NombreTipologia
  FROM `proyecto` AS P
  JOIN `tipologia` AS TIP ON TIP.id_tipologia=P.id_tipologia
  JOIN `etapa` AS ETP ON ETP.id_tipologia=TIP.id_tipologia
  WHERE P.id_proyecto=5;

SELECT PR.nom_proyecto,TIP.nom_tipologia FROM PROYECTO AS PR 
	JOIN tipologia AS TIP ON TIP.id_tipologia=PR.id_tipologia
	WHERE PR.id_proyecto=5;

SELECT ETP.nombre_etapa FROM `proyecto` AS PR 
  JOIN `tipologia` AS TIP ON PR.id_tipologia=TIP.id_tipologia
  JOIN `etapa` AS ETP ON ETP.id_tipologia=TIP.id_tipologia
  WHERE PR.id_proyecto=5;
  
SELECT *
	FROM etapa AS ETP,proyecto AS PR
	JOIN etapa_proyecto AS ETP_PR 
	ON ETP_PR.id_proyecto=PR.id_proyecto;
INSERT INTO etapa_proyecto ()

SELECT FN.nom_fuente_inf FROM `fuente_de_informacion` AS FN;
SELECT * FROM usuario;
SELECT * FROM etapa;
select * from etapa_proyecto;
SELECT * FROM financiamiento;
SELECT * FROM seguimiento_fisico;
SELECT * FROM seguimiento_financiero;
-- DELETE FROM etapa_proyecto WHERE `id_etapa_proyecto`IN (5,6,7,8,9,10,11,12);