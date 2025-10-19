# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DIGEST_WEB is a web-based data collection and management system for OECS (Organisation of Eastern Caribbean States) Member States educational statistics. The project digitizes the "Blank OECS MS Template.xlsx" Excel template into an interactive web application.

## Data Structure

The Excel template contains 9 sheets representing different aspects of educational data:

1. **Institutions** - Number and types of educational institutions (daycare, pre-schools, special schools, primary, secondary, community colleges, offshore institutions) categorized by public, private/church-assisted, and private/non-affiliated
2. **LeadersTeachersQualifications** - Staff qualifications and training data (7 tables covering different education levels)
3. **Age & Years of Service** - Personnel demographic and service data
4. **Student Enrolment** - Student enrollment statistics (8 tables covering early childhood through post-secondary)
5. **Internal Efficiency** - Dropouts and repeaters data (4 tables, note: temporal data refers to previous academic year)
6. **Systems Output** - Educational system performance metrics
7. **Financial** - Government expenditure on education (3 tables including social safety net programs like School Feeding Programme, Textbook Rental Programme, Government Transfer Grant)
8. **Population** - Population statistics relevant to education planning
9. **Sheet1** - Additional/supplementary data

### Key Data Patterns

- Academic year format: "2023-2024"
- Gender disaggregation: Most data tables split by Male/Female
- School type categorization: Public, Private/Church-assisted, Private/Non-affiliated
- Built-in Excel formulas for totals (e.g., `=SUM(B6:D6)`)
- Age calculations based on "as of Oct. 15th"
- Cost per child calculations in financial tables (e.g., `=E7/D7`)

### Important Data Notes

- **Temporal accuracy**: Dropout and repeater data collected in year X refers to year X-1
- **Trained vs Untrained**: "Trained teacher" = completed accredited teaching methodology course
- **Graduate definition**: Minimum undergraduate degree from accredited institution
- Some tables have multiple sub-tables within a single sheet

## Technical Implementation Considerations

### Data Validation Requirements

When building forms/interfaces:
- Enforce numeric input where formulas expect numbers
- Maintain gender disaggregation in all relevant tables
- Preserve calculation formulas from Excel template
- Handle school type categorization consistently
- Date/year validation for academic year format

### Excel Formula Preservation

The web application must replicate these calculation patterns:
- Row/column summations (e.g., totaling institution counts)
- Cost per child derivations (total amount / number participating)
- Gender-based aggregations (Male + Female = Total)
- Multi-cell range sums

### Data Export

Any export functionality should:
- Support Excel format to maintain compatibility with OECS reporting systems
- Preserve formulas, not just calculated values
- Maintain original sheet structure and naming conventions
- Include all 9 sheets in exports

### User Workflow

The application should mirror the logical flow of the Excel template:
- Multi-stage data entry following the A-G section structure
- Progress tracking across different data categories
- Validation before allowing progression to next section
- Save/resume capability for partially completed forms

## Data Aggregation Architecture

### Member State to Regional Collation Flow

Individual Member States submit data via the "Blank OECS MS Template.xlsx", which is then aggregated into regional chapter files. This is the core data pipeline:

**Input**: Member State Template (9 sheets) → **Output**: 6 Chapter Files + Summary

### OECS Member States

The system handles data from 9 Member States (country codes used throughout):
- **ANG** - Anguilla
- **A&B** - Antigua & Barbuda
- **DOM** - Dominica
- **GRD** - Grenada
- **MON** - Montserrat
- **SKN** - St. Kitts & Nevis
- **SLU** - St. Lucia
- **SVG** - St. Vincent & the Grenadines
- **VI** - British Virgin Islands

Plus aggregate row: **OECS** (calculated sums across all member states)

### Chapter Structure

Each chapter aggregates member state data across multiple years (2020-21, 2021-22, 2022-23):

**Chapter 1 - Institutions** (3 tables)
- Table 1.1: Early Childhood Centres (day-care centres/crèches and pre-schools by public/private type)
- Table 1.2: [Additional institution data]
- Table 1.3: [Additional institution data]

**Chapter 2 - Leaders and Teachers** (19 tables + Master sheet)
- Master sheet contains country codes/names referenced by all tables via formulas like `='Master sheet'!B3`
- Table 2.1: Professional Qualifications by Education Level and Sex (Early Childhood Administrators section visible)
- Tables span qualification data across all education levels with gender disaggregation
- Cross-references member state data using Master sheet lookups

**Chapter 3 - Student Enrolment** (49 tables)
- Table 3.1: Summary Enrolment in Public Early Childhood Education (by age and sex)
- References Sheet1 for country codes: `=Sheet1!B2`, `=Sheet1!C2`, etc.
- Most comprehensive chapter with age-based enrollment data
- Gender disaggregation throughout (M/F rows)
- Age categories: <1 Year, 1 Year, 2 Years, 3 Years, 4 Years, >4 Years, Age Unknown, Total

**Chapter 4 - [Subject TBD]** (19 tables)
- Tables 4.1 through 4.19

**Chapter 5 - System Output/Performance** (13 tables + Indicators sheet)
- Indicators sheet contains metadata/definitions
- Table 5.9 specifically tracks "5 CSEC Subjects" performance
- Tables 5.1 through 5.12 track various output metrics

**Chapter 6 - [Subject TBD]** (7 tables + Indicators sheet)
- Indicators sheet for metadata
- Tables 6.1 through 6.6

**Summary File**: "Summary of Key Education Indicators"
- Consolidates calculated indicators across all member states
- Indicators include:
  - Gross Intake Rate (GIR) first grade primary (M/F/T/GPI)
  - Net Intake Rate (NIR) first grade primary (M/F/T/GPI)
  - Transition Rate (TR) to secondary (M/F/T/GPI)
  - Gross Enrolment Rate (GER) Primary (M/F/T/GPI)
- Gender Parity Index (GPI) calculated via formulas like `=E6/E5` (Female/Male)
- Missing data represented as "..." or "�"
- Includes Male (M), Female (F), Total (T), and GPI rows for each indicator

### Cross-File References

Chapter files use Excel cell references to link data:
- **Master sheets**: Central location for country codes/names (Chapter 2 pattern)
- **Sheet1 references**: Country header mappings (Chapter 3 pattern: `=Sheet1!B2`)
- **Formula-based aggregation**: OECS totals use `=SUM(C6:C14)` patterns to sum across member state rows

### Data Aggregation Patterns

1. **Country rows**: Each table has 9 member state rows + 1 OECS total row
2. **Automatic summation**: OECS row contains formulas that sum member state data
3. **Gender disaggregation**: Consistent M/F row pairs throughout
4. **Multi-year tracking**: Each chapter has separate files per academic year
5. **Cross-sheet lookups**: Tables reference master/header sheets for consistency

### Development Implications

When building the aggregation system:
1. **Data collection phase**: Member states enter data via their template
2. **Validation phase**: Ensure data completeness before aggregation
3. **Aggregation engine**: Automatically populate chapter tables from member state submissions
4. **Formula preservation**: Maintain Excel formulas for OECS totals and GPI calculations
5. **Multi-year management**: Track and compare data across 2020-21, 2021-22, 2022-23
6. **Master data integrity**: Keep country codes/names synchronized across all chapter files
7. **Indicator calculation**: Auto-generate summary indicators with proper GPI formulas
