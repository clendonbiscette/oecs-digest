-- Insert country codes (OECS members)
INSERT INTO countries (country_code, country_name, region) VALUES
('ANU', 'Anguilla', 'OECS'),
('A&B', 'Antigua and Barbuda', 'OECS'),
('DOM', 'Dominica', 'OECS'),
('GRD', 'Grenada', 'OECS'),
('MON', 'Montserrat', 'OECS'),
('SKN', 'Saint Kitts and Nevis', 'OECS'),
('SLU', 'Saint Lucia', 'OECS'),
('SVG', 'Saint Vincent and the Grenadines', 'OECS'),
('VI', 'Virgin Islands', 'OECS')
ON CONFLICT (country_code) DO NOTHING;

-- Insert Early Childhood Centres data
INSERT INTO early_childhood_centres 
(country_code, daycare_public, daycare_private_church, daycare_private_non_affiliated, daycare_total, 
 preschool_public, preschool_private_church, preschool_private_non_affiliated, preschool_total) 
VALUES
('ANU', 0, 0, 0, 0, 0, 0, 0, 0),
('A&B', 0, 0, 0, 0, 0, 0, 0, 0),
('DOM', 0, 0, 14, 14, 29, 14, 31, 74),
('GRD', 5, 0, 0, 5, 63, 10, 31, 104),
('MON', 0, 0, 0, 0, 0, 0, 0, 0),
('SKN', 0, 0, 0, 0, 14, 0, 3, 17),
('SLU', 12, 0, 34, 46, 13, 5, 47, 65),
('SVG', 0, 0, 0, 0, 0, 0, 0, 0),
('VI', 0, 6, 20, 26, 1, 9, 20, 30)
ON CONFLICT (country_code) DO UPDATE SET
daycare_public = EXCLUDED.daycare_public,
daycare_private_church = EXCLUDED.daycare_private_church,
daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
daycare_total = EXCLUDED.daycare_total,
preschool_public = EXCLUDED.preschool_public,
preschool_private_church = EXCLUDED.preschool_private_church,
preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
preschool_total = EXCLUDED.preschool_total;

-- Insert Educational Institutions data
INSERT INTO educational_institutions
(country_code, primary_public, primary_private_church, primary_private_non_affiliated, primary_total,
 secondary_public, secondary_private_church, secondary_private_non_affiliated, secondary_total,
 special_ed_public, special_ed_private_church, special_ed_private_non_affiliated, special_ed_total,
 tvet_public, tvet_private_church, tvet_private_non_affiliated, tvet_total)
VALUES
('ANU', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('A&B', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('DOM', 45, 5, 7, 57, 7, 6, 2, 15, 0, 0, 2, 2, 0, 0, 0, 0),
('GRD', 56, 8, 31, 95, 21, 1, 3, 25, 3, 0, 0, 3, 1, 1, 0, 2),
('MON', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('SKN', 17, 0, 5, 22, 6, 0, 2, 8, 2, 0, 0, 2, 1, 0, 0, 1),
('SLU', 72, 15, 7, 94, 20, 1, 3, 24, 4, 0, 1, 5, 1, 1, 0, 2),
('SVG', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('VI', 13, 3, 8, 24, 4, 2, 2, 8, 1, 0, 0, 1, 1, 0, 0, 1)
ON CONFLICT (country_code) DO UPDATE SET
primary_public = EXCLUDED.primary_public,
primary_private_church = EXCLUDED.primary_private_church,
primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
primary_total = EXCLUDED.primary_total,
secondary_public = EXCLUDED.secondary_public,
secondary_private_church = EXCLUDED.secondary_private_church,
secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
secondary_total = EXCLUDED.secondary_total,
special_ed_public = EXCLUDED.special_ed_public,
special_ed_private_church = EXCLUDED.special_ed_private_church,
special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
special_ed_total = EXCLUDED.special_ed_total,
tvet_public = EXCLUDED.tvet_public,
tvet_private_church = EXCLUDED.tvet_private_church,
tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
tvet_total = EXCLUDED.tvet_total;

-- Insert Post-Secondary Institutions data
INSERT INTO post_secondary_institutions
(country_code, public_institutions, private_institutions, total)
VALUES
('ANU', 0, 0, 0),
('A&B', 0, 0, 0),
('DOM', 1, 4, 5),
('GRD', 1, 1, 2),
('MON', 0, 0, 0),
('SKN', 2, 2, 4),
('SLU', 1, 0, 1),
('SVG', 2, 0, 2),
('VI', 1, 0, 1)
ON CONFLICT (country_code) DO UPDATE SET
public_institutions = EXCLUDED.public_institutions,
private_institutions = EXCLUDED.private_institutions,
total = EXCLUDED.total;
