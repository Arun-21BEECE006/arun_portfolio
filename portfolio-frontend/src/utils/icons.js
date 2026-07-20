import {
  RiLayoutLine,
  RiServerLine,
  RiBrainLine,
  RiCameraLine,
  RiDatabase2Line,
  RiCloudLine,
  RiCodeSSlashLine,
  RiCpuLine,
  RiToolsLine,
  RiTrophyLine,
  RiAwardLine,
  RiFocus3Line,
  RiGraduationCapLine,
  RiMedalLine,
  RiVerifiedBadgeLine,
} from "react-icons/ri";

export const SKILL_ICONS = {
  layout: RiLayoutLine,
  server: RiServerLine,
  brain: RiBrainLine,
  camera: RiCameraLine,
  database: RiDatabase2Line,
  cloud: RiCloudLine,
  code: RiCodeSSlashLine,
  cpu: RiCpuLine,
};

export function getSkillIcon(key) {
  return SKILL_ICONS[key] || RiToolsLine;
}

export const ACHIEVEMENT_ICONS = {
  trophy: RiTrophyLine,
  award: RiAwardLine,
  target: RiFocus3Line,
  "graduation-cap": RiGraduationCapLine,
  medal: RiMedalLine,
  "badge-check": RiVerifiedBadgeLine,
};

export function getAchievementIcon(key) {
  return ACHIEVEMENT_ICONS[key] || RiTrophyLine;
}
