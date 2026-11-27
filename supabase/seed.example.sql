-- Copy this to seed.local.sql (ignored by git, so real names stay out of the repo),
-- replace the sample names, then run it in Supabase > SQL Editor.
insert into public.students (full_name, section) values
  ('Sample Student One', 'IT235'),
  ('Sample Student Two', 'IT235'),
  ('Sample Student Three', 'IT232');

-- Someone joined late or has a different requirement? For example:
-- insert into public.students (full_name, section, required_hours) values ('Name', 'IT235', 486);
