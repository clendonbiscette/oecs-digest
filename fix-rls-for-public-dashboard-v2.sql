-- =====================================================
-- FIX: Allow Public Access to Dashboard Data (V2)
-- =====================================================
-- This version drops ALL existing policies first to avoid conflicts
-- =====================================================

-- Drop ALL existing policies for institutions table
DROP POLICY IF EXISTS "Statisticians can view own country institutions" ON institutions;
DROP POLICY IF EXISTS "Statisticians can manage own country institutions" ON institutions;
DROP POLICY IF EXISTS "Statisticians can update own country institutions" ON institutions;
DROP POLICY IF EXISTS "Statisticians can delete own country institutions" ON institutions;
DROP POLICY IF EXISTS "Public can view all institutions" ON institutions;

-- Drop ALL existing policies for enrollment tables
DROP POLICY IF EXISTS "Statisticians can view own country EC enrollment" ON early_childhood_enrollment;
DROP POLICY IF EXISTS "Statisticians can manage own country EC enrollment" ON early_childhood_enrollment;
DROP POLICY IF EXISTS "Statisticians can update own country EC enrollment" ON early_childhood_enrollment;
DROP POLICY IF EXISTS "Public can view all early childhood enrollment" ON early_childhood_enrollment;

DROP POLICY IF EXISTS "Statisticians can view own country primary enrollment" ON primary_enrollment;
DROP POLICY IF EXISTS "Statisticians can manage own country primary enrollment" ON primary_enrollment;
DROP POLICY IF EXISTS "Statisticians can update own country primary enrollment" ON primary_enrollment;
DROP POLICY IF EXISTS "Public can view all primary enrollment" ON primary_enrollment;

DROP POLICY IF EXISTS "Statisticians can view own country secondary enrollment" ON secondary_enrollment;
DROP POLICY IF EXISTS "Statisticians can manage own country secondary enrollment" ON secondary_enrollment;
DROP POLICY IF EXISTS "Statisticians can update own country secondary enrollment" ON secondary_enrollment;
DROP POLICY IF EXISTS "Public can view all secondary enrollment" ON secondary_enrollment;

DROP POLICY IF EXISTS "Statisticians can view own country special ed enrollment" ON special_education_enrollment;
DROP POLICY IF EXISTS "Statisticians can manage own country special ed enrollment" ON special_education_enrollment;
DROP POLICY IF EXISTS "Statisticians can update own country special ed enrollment" ON special_education_enrollment;
DROP POLICY IF EXISTS "Public can view all special ed enrollment" ON special_education_enrollment;

-- =====================================================
-- CREATE NEW POLICIES - INSTITUTIONS TABLE
-- =====================================================

-- Public can READ all institutions data
CREATE POLICY "Public can view all institutions" ON institutions
    FOR SELECT USING (true);

-- Statisticians can INSERT their country's data
CREATE POLICY "Statisticians can insert own country institutions" ON institutions
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Statisticians can UPDATE their country's data
CREATE POLICY "Statisticians can update own country institutions" ON institutions
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Statisticians can DELETE their country's data
CREATE POLICY "Statisticians can delete own country institutions" ON institutions
    FOR DELETE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- CREATE NEW POLICIES - EARLY CHILDHOOD ENROLLMENT
-- =====================================================

CREATE POLICY "Public can view all early childhood enrollment" ON early_childhood_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Statisticians can insert own country EC enrollment" ON early_childhood_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country EC enrollment" ON early_childhood_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- CREATE NEW POLICIES - PRIMARY ENROLLMENT
-- =====================================================

CREATE POLICY "Public can view all primary enrollment" ON primary_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Statisticians can insert own country primary enrollment" ON primary_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country primary enrollment" ON primary_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- CREATE NEW POLICIES - SECONDARY ENROLLMENT
-- =====================================================

CREATE POLICY "Public can view all secondary enrollment" ON secondary_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Statisticians can insert own country secondary enrollment" ON secondary_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country secondary enrollment" ON secondary_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- CREATE NEW POLICIES - SPECIAL EDUCATION ENROLLMENT
-- =====================================================

CREATE POLICY "Public can view all special ed enrollment" ON special_education_enrollment
    FOR SELECT USING (true);

CREATE POLICY "Statisticians can insert own country special ed enrollment" ON special_education_enrollment
    FOR INSERT WITH CHECK (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Statisticians can update own country special ed enrollment" ON special_education_enrollment
    FOR UPDATE USING (
        country_id IN (
            SELECT country_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✓ Public users can READ all education data (for dashboard)
-- ✓ Only authenticated statisticians can WRITE data for their country
-- ✓ Admins still have full access via service role key
-- =====================================================
