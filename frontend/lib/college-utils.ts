import type { BackendCollege } from "@/lib/api";

export type NormalizedCollege = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  linguisticMinority: boolean;
  facilities: string[];
  degrees: string[];
  featuredCourse: string;
  feesLabel: string;
  placementLabel: string;
  avgPackageLabel: string;
  roiLabel: string;
};

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function normalizeCollege(college: BackendCollege): NormalizedCollege {
  const firstCourse = college.courses?.[0];
  const featuredCourse = [firstCourse?.degree, firstCourse?.branch]
    .filter(Boolean)
    .join(" ")
    .trim();

  const degrees = Array.from(
    new Set(
      (college.courses || [])
        .map((course) => course.degree)
        .filter((degree): degree is string => Boolean(degree)),
    ),
  );

  return {
    id: college.id || college.college_name || Math.random().toString(36),
    name: college.college_name || "Unknown college",
    city: college.city || "Unknown city",
    state: college.state || "Unknown state",
    type: college.type || "Unknown type",
    linguisticMinority: Boolean(college.linguistic_minority),
    facilities: college.facilities || [],
    degrees,
    featuredCourse: featuredCourse || "Course details not available",
    feesLabel: formatCurrency(firstCourse?.fees?.total_fees),
    placementLabel: firstCourse?.placements?.placement_percentage
      ? `${firstCourse.placements.placement_percentage}%`
      : "Not available",
    avgPackageLabel: formatCurrency(firstCourse?.placements?.avg_package),
    roiLabel: college.roi?.roi_score ? `${college.roi.roi_score}/10` : "N/A",
  };
}
