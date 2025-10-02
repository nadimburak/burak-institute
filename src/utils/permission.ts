export const rolesPermissions = [

  // 🔹 Course Access
  { name: "Can browse available courses", status: true, key: 'browse_courses' },
  { name: "Can enroll in courses", status: true, key: 'enroll_courses' },
  { name: "Can access enrolled courses", status: true, key: 'access_enrolled_courses' },
  { name: "Can view course progress", status: true, key: 'view_course_progress' },

  // 🔹 Study Materials & Notes
  { name: "Can view study materials", status: true, key: 'view_study_materials' },
  { name: "Can download notes", status: true, key: 'download_notes' },
  { name: "Can bookmark materials", status: true, key: 'bookmark_materials' },

  // 🔹 Assignments
  { name: "Can view assignments", status: true, key: 'view_assignments' },
  { name: "Can attempt assignments", status: true, key: 'attempt_assignments' },
  { name: "Can submit assignments", status: true, key: 'submit_assignments' },
  { name: "Can view assignment feedback", status: true, key: 'view_assignment_feedback' },
  { name: "Can view assignment grades", status: true, key: 'view_assignment_grades' },

  // 🔹 Quizzes & Exams
  { name: "Can attempt quizzes", status: true, key: 'attempt_quizzes' },
  { name: "Can view quiz results", status: true, key: 'view_quiz_results' },
  { name: "Can retake quiz (if allowed)", status: true, key: 'retake_quiz' },

  // 🔹 Lectures & Videos
  { name: "Can attend live lectures", status: true, key: 'attend_live_lectures' },
  { name: "Can watch recorded lectures", status: true, key: 'watch_recorded_lectures' },
  { name: "Can download lecture resources", status: true, key: 'download_lecture_resources' },
  { name: "Can ask questions during lecture", status: true, key: 'ask_questions_during_lecture' },

  // 🔹 Chat & Discussion
  { name: "Can access chat section", status: true, key: 'access_chat_section' },
  { name: "Can create chat", status: true, key: 'create_chat' },
  { name: "Can edit own chat", status: true, key: 'edit_own_chat' },
  { name: "Can delete own chat", status: true, key: 'delete_own_chat' },
  { name: "Can send messages", status: true, key: 'send_messages' },
  { name: "Can react to messages", status: true, key: 'react_to_messages' },
  { name: "Can report messages", status: true, key: 'report_messages' },

  // 🔹 Profile & Account
  { name: "Can view own profile", status: true, key: 'view_own_profile' },
  { name: "Can edit profile", status: true, key: 'edit_profile' },
  { name: "Can change password", status: true, key: 'change_password' },

  // 🔹 Notifications & Support
  { name: "Can receive notifications", status: true, key: 'receive_notifications' },
  { name: "Can manage notification settings", status: true, key: 'manage_notification_settings' },
  { name: "Can contact support", status: true, key: 'contact_support' },

  // 🔹 Miscellaneous
  { name: "Can view announcements", status: true, key: 'view_announcements' },
  { name: "Can provide feedback", status: true, key: 'provide_feedback' },

  // 🔹 Student Monitoring
  { name: "Can view child's enrolled courses", status: true, key: 'view_child_courses' },
  { name: "Can view child's course progress", status: true, key: 'view_child_progress' },
  { name: "Can view child's attendance records", status: true, key: 'view_child_attendance' },
  { name: "Can view child's grades", status: true, key: 'view_child_grades' },
  { name: "Can view child's assignment submissions", status: true, key: 'view_child_assignment_submissions' },
  { name: "Can view child's quiz/exam results", status: true, key: 'view_child_quiz_result' },

  // 🔹 Communication
  { name: "Can message teachers", status: true, key: 'message_teacher' },
  { name: "Can message school staff", status: true, key: 'message_school_staff' },
  { name: "Can join parent-teacher chat", status: true, key: 'join_parent_teacher_chat' },
  { name: "Can participate in parent forums", status: true, key: 'participation_parent_forums' },
  { name: "Can view announcements", status: true, key: 'view_announcements' },
  { name: "Can receive notifications", status: true, key: 'receive_notifications' },

  // 🔹 Attendance & Behavior
  { name: "Can view attendance summary", status: true, key: 'view_attendance_summary' },
  { name: "Can receive attendance alerts", status: true, key: 'receive_attendance_alerts' },
  { name: "Can view behavioral reports", status: true, key: 'view_behavioral_reports' },
  { name: "Can receive discipline notifications", status: true, key: 'receive_discipline_notifications' },

  // 🔹 Support & Feedback
  { name: "Can contact support", status: true, key: 'contact_support' },
  { name: "Can submit feedback", status: true, key: 'submit_feedback' },
  { name: "Can schedule meetings with teachers", status: true, key: 'schedule_meetings_with_teachers' },

  // 🔹 Account Management
  { name: "Can view own profile", status: true, key: 'view_own_profile' },
  { name: "Can edit own profile", status: true, key: 'edit_own_profile' },
  { name: "Can change password", status: true, key: 'change_password' },
  { name: "Can manage notification preferences", status: true, key: 'manage_notification_preferences' },

  // 🔹 Course Management
  { name: "Can create courses", status: true, key: 'create_courses' },
  { name: "Can edit courses", status: true, key: 'edit_courses' },
  { name: "Can delete courses", status: true, key: 'delete_courses' },
  { name: "Can publish/unpublish courses", status: true, key: 'publish_unpublish_courses' },
  { name: "Can manage course modules and lessons", status: true, key: 'manage_course_modules_and_lessons' },
  { name: "Can upload study materials", status: true, key: 'upload_study_materials' },
  { name: "Can update study materials", status: true, key: 'update_study_materials' },
  { name: "Can remove study materials", status: true, key: 'remove_study_materials' },
  { name: "Can manage course schedule", status: true, key: 'manage_course_schedule' },

  // 🔹 Lecture & Video
  { name: "Can host live lectures", status: true, key: 'host_live_lectures' },
  { name: "Can upload recorded lectures", status: true, key: 'upload_recorded_lectures' },
  { name: "Can share lecture resources", status: true, key: 'share_lecture_resources' },
  { name: "Can manage lecture recordings", status: true, key: 'manage_lecture_recordings' },

  // 🔹 Assignment Management
  { name: "Can create assignments", status: true, key: 'create_assignments' },
  { name: "Can edit assignments", status: true, key: 'edit_assignments' },
  { name: "Can delete assignments", status: true, key: 'delete_assignments' },
  { name: "Can view student submissions", status: true, key: 'view_student_submissions' },
  { name: "Can grade assignments", status: true, key: 'grade_assignments' },
  { name: "Can provide feedback on assignments", status: true, key: 'provide_feedback_on_assignments' },
  { name: "Can reopen assignments for resubmission", status: true, key: 'reopen_assignments_for_resubmission' },

  // 🔹 Quizzes & Exams
  { name: "Can create quizzes/exams", status: true, key: 'create_quizzes_exams' },
  { name: "Can edit quizzes/exams", status: true, key: 'edit_quizzes_exams' },
  { name: "Can delete quizzes/exams", status: true, key: 'delete_quizzes_exams' },
  { name: "Can grade quizzes/exams", status: true, key: 'grade_quizzes_exams' },
  { name: "Can view quiz results", status: true, key: 'view_quiz_results' },
  { name: "Can allow quiz retakes", status: true, key: 'allow_quiz_retakes' },

  // 🔹 Student Management
  { name: "Can view enrolled students", status: true, key: 'view_enrolled_students' },
  { name: "Can view student profiles", status: true, key: 'view_student_profiles' },
  { name: "Can track student progress", status: true, key: 'track_student_progress' },
  { name: "Can view attendance records", status: true, key: 'view_attendance_records' },
  { name: "Can mark attendance", status: true, key: 'mark_attendance' },
  { name: "Can send notifications to students", status: true, key: 'send_notifications_to_students' },
  { name: "Can assign extra credit or penalties", status: true, key: 'assign_extra_credit_or_penalties' },

  // 🔹 Communication & Collaboration
  { name: "Can access chat section", status: true, key: 'access_chat_section' },
  { name: "Can create class chat", status: true, key: 'create_class_chat' },
  { name: "Can delete any chat message", status: true, key: 'delete_any_chat_message' },
  { name: "Can reply to student messages", status: true, key: 'reply_to_student_messages' },
  { name: "Can send announcements", status: true, key: 'send_announcements' },
  { name: "Can participate in parent-teacher chat", status: true, key: 'participate_in_parent_teacher_chat' },

  // 🔹 Feedback & Reports
  { name: "Can generate performance reports", status: true, key: 'generate_performance_reports' },
  { name: "Can view analytics dashboard", status: true, key: 'view_analytics_dashboard' },
  { name: "Can export student data (CSV/PDF)", status: true, key: 'export_student_data' },
  { name: "Can submit feedback to admins", status: true, key: 'submit_feedback_to_admins' },

  // 🔹 Profile & Account
  { name: "Can view own profile", status: true, key: 'view_own_profile' },
  { name: "Can edit own profile", status: true, key: 'edit_own_profile' },
  { name: "Can change password", status: true, key: 'change_password' },
  { name: "Can manage notification preferences", status: true, key: 'manage_notification_preferences' },

  {name:"all", status:true, key:'all'}
]
