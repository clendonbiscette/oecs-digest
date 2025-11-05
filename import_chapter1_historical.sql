
-- Ensure academic years exist
INSERT INTO academic_years (year_label, start_year, end_year, is_active)
VALUES
    ('2020-2021', 2020, 2021, false),
    ('2021-2022', 2021, 2022, false),
    ('2022-2023', 2022, 2023, false)
ON CONFLICT (year_label) DO NOTHING;


-- ANG - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ANG'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    0, 0, 0,
    0, 6, 2,
    6, 0, 1,
    1, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- ATG - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ATG'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- DMA - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'DMA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    0, 0, 12,
    25, 19, 31,
    45, 5, 7,
    7, 6, 2,
    0, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- GRD - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'GRD'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    10, 1, 29,
    63, 10, 31,
    56, 8, 13,
    21, 1, 3,
    3, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- MSR - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'MSR'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    1, 2
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- KNA - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'KNA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    13, 1, 3,
    7, 5, 15,
    24, 1, 9,
    8, 1, 1,
    0, 0, 0,
    0, 0, 0,
    1, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- LCA - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'LCA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    20, 4, 11,
    0, 3, 93,
    71, 3, 4,
    22, 1, 2,
    0, 0, 1,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- VCT - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VCT'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    0, 0, 0,
    15, 43, 50,
    57, 5, 5,
    21, 7, 1,
    2, 1, 0,
    0, 0, 0,
    3, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- VGB - 2021-2022
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VGB'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    1, 5, 18,
    2, 8, 16,
    12, 3, 5,
    4, 2, 2,
    1, 0, 1,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- ANG - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ANG'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- ATG - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ATG'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- DMA - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'DMA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 0, 14,
    29, 14, 31,
    45, 5, 7,
    7, 6, 2,
    0, 0, 2,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- GRD - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'GRD'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    5, 0, 0,
    63, 10, 31,
    56, 8, 31,
    21, 1, 3,
    3, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- MSR - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'MSR'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    1, 4
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- KNA - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'KNA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    13, 1, 3,
    7, 5, 15,
    24, 1, 0,
    8, 0, 9,
    2, 0, 0,
    0, 0, 0,
    1, 1
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- LCA - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'LCA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    20, 1, 17,
    0, 3, 85,
    71, 3, 3,
    22, 1, 2,
    5, 0, 0,
    0, 0, 0,
    0, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- VCT - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VCT'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 0, 0,
    15, 48, 47,
    57, 5, 5,
    21, 7, 1,
    2, 0, 1,
    0, 0, 0,
    2, 2
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();


-- VGB - 2022-2023
INSERT INTO institutions (
    country_id,
    academic_year_id,
    daycare_public, daycare_private_church, daycare_private_non_affiliated,
    preschool_public, preschool_private_church, preschool_private_non_affiliated,
    primary_public, primary_private_church, primary_private_non_affiliated,
    secondary_public, secondary_private_church, secondary_private_non_affiliated,
    special_ed_public, special_ed_private_church, special_ed_private_non_affiliated,
    tvet_public, tvet_private_church, tvet_private_non_affiliated,
    post_secondary_public, post_secondary_private
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VGB'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    0, 6, 20,
    1, 9, 20,
    13, 3, 8,
    4, 2, 2,
    1, 0, 0,
    0, 0, 0,
    1, 0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    daycare_public = EXCLUDED.daycare_public,
    daycare_private_church = EXCLUDED.daycare_private_church,
    daycare_private_non_affiliated = EXCLUDED.daycare_private_non_affiliated,
    preschool_public = EXCLUDED.preschool_public,
    preschool_private_church = EXCLUDED.preschool_private_church,
    preschool_private_non_affiliated = EXCLUDED.preschool_private_non_affiliated,
    primary_public = EXCLUDED.primary_public,
    primary_private_church = EXCLUDED.primary_private_church,
    primary_private_non_affiliated = EXCLUDED.primary_private_non_affiliated,
    secondary_public = EXCLUDED.secondary_public,
    secondary_private_church = EXCLUDED.secondary_private_church,
    secondary_private_non_affiliated = EXCLUDED.secondary_private_non_affiliated,
    special_ed_public = EXCLUDED.special_ed_public,
    special_ed_private_church = EXCLUDED.special_ed_private_church,
    special_ed_private_non_affiliated = EXCLUDED.special_ed_private_non_affiliated,
    tvet_public = EXCLUDED.tvet_public,
    tvet_private_church = EXCLUDED.tvet_private_church,
    tvet_private_non_affiliated = EXCLUDED.tvet_private_non_affiliated,
    post_secondary_public = EXCLUDED.post_secondary_public,
    post_secondary_private = EXCLUDED.post_secondary_private,
    updated_at = NOW();
