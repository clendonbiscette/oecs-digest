-- Chapter 6: Financial Data Import
-- Generated from historical Excel files


-- Create financial_data table
CREATE TABLE IF NOT EXISTS financial_data (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    academic_year_id INTEGER REFERENCES academic_years(id),
    national_budget_total DECIMAL(15,2),
    national_budget_recurrent DECIMAL(15,2),
    national_budget_capital DECIMAL(15,2),
    gdp DECIMAL(15,2),
    education_budget_total DECIMAL(15,2),
    education_budget_recurrent DECIMAL(15,2),
    education_budget_capital DECIMAL(15,2),
    education_pct_national_budget DECIMAL(5,2),
    education_pct_gdp DECIMAL(5,2),
    allocation_early_childhood DECIMAL(15,2),
    allocation_primary DECIMAL(15,2),
    allocation_secondary DECIMAL(15,2),
    allocation_special_ed DECIMAL(15,2),
    allocation_post_secondary DECIMAL(15,2),
    allocation_tertiary DECIMAL(15,2),
    allocation_other DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, academic_year_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_financial_country ON financial_data(country_id);
CREATE INDEX IF NOT EXISTS idx_financial_year ON financial_data(academic_year_id);

-- Enable RLS
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view financial data" ON financial_data;
CREATE POLICY "Users can view financial data" ON financial_data
    FOR SELECT TO authenticated USING (true);

GRANT SELECT ON financial_data TO authenticated;


-- ATG - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ATG'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- DMA - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'DMA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    903269301.0, 650014307.0, 253254994.0, 1508611111.0, 84728783.0, 78789890.0, 5938893.0, 9.38, 0.06, 3052648.0, 24710653.0, 27178686.0, 4771804.0, 20081838.0, NULL, 4933154.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- GRD - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'GRD'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    995500000.0, 661700000.0, 333800000.0, 1256410000.0, 129608662.0, 105237934.0, 24370728.0, 13.02, 0.1, 9860808.0, 35395391.0, 25946353.0, 3164321.0, 15177900.0, NULL, 40063889.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- MSR - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'MSR'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- KNA - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'KNA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    909057139.0, 728625940.0, 180431199.0, 26439000000.0, 219081540.0, 104535000.0, 114546540.0, 24.1, 0.83, 7398000.0, 17909000.0, 95741570.0, 1581000.0, 51259400.0, NULL, 45192570.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- LCA - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'LCA'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    1638600900.0, 1359997100.0, 278603800.0, 4365290000.0, 237066000.0, 209631500.0, 27434500.0, 14.47, 5.43, 3214755.0, 67977709.0, 82486501.0, 5111280.0, 18020184.0, NULL, 60255571.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- VCT - 2021-2022
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VCT'),
    (SELECT id FROM academic_years WHERE year_label = '2021-2022'),
    1212601579.0, 895199329.0, 317402250.0, 2369760000.0, 168211768.0, 138170358.0, 30041410.0, 13.87, 7.1, NULL, 55942990.0, 53542431.0, 2186900.0, 21153000.0, NULL, 22285496.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- DMA - 2022-2023
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'DMA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    1471854653.0, 649958514.0, 821896139.0, 1662873613.0, 106270972.0, 71489238.0, 34781734.0, 7.22020831224019, 0.06390802713, 815473.0, 23969027.0, 61383582.0, 3676249.0, 12602271.0, NULL, 3824370.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- GRD - 2022-2023
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'GRD'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    860300000.0, 598600000.0, 261700000.0, 3413548982.0, 133500000.0, 108400000.0, 25100000.0, 15.517842613041962, 0.03910885729, 8090285.0, 34896180.0, 25694507.0, 3200000.0, 15995000.0, NULL, 45624028.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- KNA - 2022-2023
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'KNA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    990922736.0, 812147065.0, 178775671.0, 2612471218.0, 111857074.0, 93519864.0, 18337210.0, 11.288173127556536, 0.04281657659, 10810000.0, 23024000.0, 39943000.0, 1952000.0, 6054700.0, NULL, 19345400.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- LCA - 2022-2023
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'LCA'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    1842627447.0, 1349424847.0, 493202600.0, 5610473367.0, 233445500.0, 210397200.0, 23048300.0, 12.669164370696578, 0.04160887767, 4029889.0, 65682323.0, 87197118.0, 4735817.0, 17525164.0, NULL, 54275189.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- VCT - 2022-2023
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VCT'),
    (SELECT id FROM academic_years WHERE year_label = '2022-2023'),
    1329340860.0, 931877660.0, 397463200.0, 2577138597.0, 169298228.0, 139914038.0, 29384190.0, 12.735501713232528, 0.06569232567, 0.0, 56593478.0, 51745721.0, 2275030.0, 20750000.0, NULL, 24163654.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- ATG - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'ATG'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- DMA - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'DMA'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- GRD - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'GRD'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    1033773121.0, 606524716.0, 427248405.0, 1609290000.0, 82107863.0, 74410922.0, 7696941.0, 7.94, 5.55, 728982.0, 29695487.0, 25940033.0, 5435957.0, 16883690.0, NULL, 3423714.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- MSR - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'MSR'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    927062755.0, 621455460.0, 305607295.0, 2817000000.0, 169162412.0, 162603412.0, 6559000.0, 18.0, 6.0, 6766186.0, 34085308.0, 24925753.0, 3025940.0, 15088148.0, NULL, 85271077.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- KNA - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'KNA'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- LCA - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'LCA'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    830907043.0, 638211620.0, 192695423.0, 0.0, 104270000.0, 103980000.0, 290000.0, 13.0, NULL, 7352000.0, 17651000.0, 45946000.0, 0.0, 14636000.0, NULL, 18683441.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- VCT - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VCT'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    1697312800.0, 1361926800.0, 335386000.0, 0.0, 224583500.0, 200682469.0, 23901031.0, 13.0, NULL, 2692099.0, 67345149.0, 82873951.0, 4562342.0, 17525164.0, NULL, 49584795.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;

-- VGB - 2020-2021
INSERT INTO financial_data (
    country_id,
    academic_year_id,
    national_budget_total, national_budget_recurrent, national_budget_capital,
    gdp, education_budget_total, education_budget_recurrent, education_budget_capital,
    education_pct_national_budget, education_pct_gdp,
    allocation_early_childhood, allocation_primary, allocation_secondary,
    allocation_special_ed, allocation_post_secondary, allocation_tertiary, allocation_other
)
VALUES (
    (SELECT id FROM countries WHERE country_code = 'VGB'),
    (SELECT id FROM academic_years WHERE year_label = '2020-2021'),
    1186351151.0, 875583941.0, 310767210.0, 0.0, 154829794.0, 137221684.0, 17608110.0, 13.0, NULL, 0.0, 52621136.0, 48638716.0, 2098717.0, 20158000.0, NULL, 20743126.0
)
ON CONFLICT (country_id, academic_year_id)
DO UPDATE SET
    national_budget_total = EXCLUDED.national_budget_total,
    national_budget_recurrent = EXCLUDED.national_budget_recurrent,
    national_budget_capital = EXCLUDED.national_budget_capital,
    gdp = EXCLUDED.gdp,
    education_budget_total = EXCLUDED.education_budget_total,
    education_budget_recurrent = EXCLUDED.education_budget_recurrent,
    education_budget_capital = EXCLUDED.education_budget_capital,
    education_pct_national_budget = EXCLUDED.education_pct_national_budget,
    education_pct_gdp = EXCLUDED.education_pct_gdp,
    allocation_early_childhood = EXCLUDED.allocation_early_childhood,
    allocation_primary = EXCLUDED.allocation_primary,
    allocation_secondary = EXCLUDED.allocation_secondary,
    allocation_special_ed = EXCLUDED.allocation_special_ed,
    allocation_post_secondary = EXCLUDED.allocation_post_secondary,
    allocation_tertiary = EXCLUDED.allocation_tertiary,
    allocation_other = EXCLUDED.allocation_other;
