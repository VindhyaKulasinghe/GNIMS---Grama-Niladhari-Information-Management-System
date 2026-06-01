-- Optional seed: common domestic animals in Southern Province villages
-- Safe to run multiple times (skips rows that already exist with the same name)

INSERT INTO public.animals (name, category)
SELECT v.name, v.category
FROM (
  VALUES
    ('Cattle (Cow)', 'Livestock'),
    ('Buffalo', 'Livestock'),
    ('Pig', 'Livestock'),
    ('Chicken', 'Poultry'),
    ('Dog', 'Pets'),
    ('Cat', 'Pets'),
    ('Rabbit', 'Small Animals'),
    ('Pigeon', 'Small Animals'),
    ('Bee Hive (Honey Bee)', 'Other')
) AS v(name, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.animals a
  WHERE lower(trim(a.name)) = lower(trim(v.name))
);

-- To drop removed types: run migration-remove-domestic-animals.sql
