-- Create views for easier data access
CREATE OR REPLACE VIEW education_summary AS
SELECT 
    c.country_code,
    c.country_name,
    COALESCE(ecc.daycare_total, 0) as total_daycare_centres,
    COALESCE(ecc.preschool_total, 0) as total_preschools,
    COALESCE(ei.primary_total, 0) as total_primary_schools,
    COALESCE(ei.secondary_total, 0) as total_secondary_schools,
    COALESCE(ei.special_ed_total, 0) as total_special_ed_schools,
    COALESCE(ei.tvet_total, 0) as total_tvet_institutions,
    COALESCE(psi.total, 0) as total_post_secondary
FROM countries c
LEFT JOIN early_childhood_centres ecc ON c.country_code = ecc.country_code
LEFT JOIN educational_institutions ei ON c.country_code = ei.country_code
LEFT JOIN post_secondary_institutions psi ON c.country_code = psi.country_code;

-- Regional Summary (OECS Total)
CREATE OR REPLACE VIEW oecs_regional_summary AS
SELECT 
    'OECS' as region,
    -- Early Childhood
    SUM(ecc.daycare_public) as daycare_public,
    SUM(ecc.daycare_private_church) as daycare_private_church,
    SUM(ecc.daycare_private_non_affiliated) as daycare_private_non_affiliated,
    SUM(ecc.daycare_total) as daycare_total,
    SUM(ecc.preschool_public) as preschool_public,
    SUM(ecc.preschool_private_church) as preschool_private_church,
    SUM(ecc.preschool_private_non_affiliated) as preschool_private_non_affiliated,
    SUM(ecc.preschool_total) as preschool_total,
    -- Primary through TVET totals
    SUM(ei.primary_total) as primary_total,
    SUM(ei.secondary_total) as secondary_total,
    SUM(ei.special_ed_total) as special_ed_total,
    SUM(ei.tvet_total) as tvet_total,
    -- Post-secondary
    SUM(psi.public_institutions) as post_secondary_public,
    SUM(psi.private_institutions) as post_secondary_private,
    SUM(psi.total) as post_secondary_total
FROM early_childhood_centres ecc
JOIN educational_institutions ei USING (country_code)
JOIN post_secondary_institutions psi USING (country_code);
