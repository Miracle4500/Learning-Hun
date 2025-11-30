
<?php
session_start();
date_default_timezone_set('Africa/Lagos');

// File-based storage setup
$data_dir = __DIR__ . '/naija_data';
if (!file_exists($data_dir)) {
    mkdir($data_dir, 0777, true);
    // Initialize data files
    file_put_contents($data_dir . '/users.json', json_encode([
        [
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'miracleekeoha07@outlook.com',
            'phone' => '08031234567',
            'password' => password_hash('09026852685', PASSWORD_DEFAULT),
            'is_admin' => true,
            'subscription_status' => 'active',
            'subscription_expiry' => date('Y-m-d', strtotime('+1 month')),
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 2,
            'name' => 'Demo User',
            'email' => 'user@example.com',
            'phone' => '07069876543',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'is_admin' => false,
            'subscription_status' => 'active',
            'subscription_expiry' => date('Y-m-d', strtotime('+1 month')),
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]));
    
    file_put_contents($data_dir . '/courses.json', json_encode([
        ['id' => 1, 'title' => 'HTML Fundamentals', 'description' => 'Learn the basics of HTML to create your first website', 'price' => 25000, 'video_url' => 'https://www.youtube.com/embed/UB1O30fR-EE', 'created_at' => date('Y-m-d H:i:s')],
        ['id' => 2, 'title' => 'PHP Backend', 'description' => 'Create dynamic websites with PHP and MySQL', 'price' => 25000, 'video_url' => 'https://www.youtube.com/embed/OK_JCtrrv-c', 'created_at' => date('Y-m-d H:i:s')],
        ['id' => 3, 'title' => 'JavaScript Mastery', 'description' => 'Create interactive websites with modern JavaScript', 'price' => 25000, 'video_url' => 'https://www.youtube.com/embed/PkZNo7MFNFg', 'created_at' => date('Y-m-d H:i:s')]
    ]));
    
    file_put_contents($data_dir . '/payments.json', json_encode([]));
    file_put_contents($data_dir . '/videos', '');
}

// Data loading functions
function load_data($file) {
    global $data_dir;
    $path = $data_dir . '/' . $file . '.json';
    if (file_exists($path)) {
        $content = file_get_contents($path);
        return json_decode($content, true) ?: [];
    }
    return [];
}

function save_data($file, $data) {
    global $data_dir;
    $path = $data_dir . '/' . $file . '.json';
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));
}

// Authentication functions
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

function login($email, $password) {
    $users = load_data('users');
    foreach ($users as $user) {
        if ($user['email'] === $email && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['is_admin'] = $user['is_admin'];
            $_SESSION['subscription_status'] = $user['subscription_status'];
            $_SESSION['subscription_expiry'] = $user['subscription_expiry'];
            return true;
        }
    }
    return false;
}

function register_user($name, $email, $phone, $password) {
    $users = load_data('users');
    
    // Check if email exists
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            return false;
        }
    }
    
    $new_user = [
        'id' => count($users) + 1,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'is_admin' => false,
        'subscription_status' => 'pending',
        'subscription_expiry' => date('Y-m-d', strtotime('+1 month')),
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $users[] = $new_user;
    save_data('users', $users);
    return true;
}

function check_subscription_status() {
    if (!is_logged_in()) return false;
    
    $users = load_data('users');
    foreach ($users as &$user) {
        if ($user['id'] === $_SESSION['user_id']) {
            // Check if subscription has expired
            if ($user['subscription_status'] == 'active' && strtotime($user['subscription_expiry']) < time()) {
                $user['subscription_status'] = 'expired';
                save_data('users', $users);
                $_SESSION['subscription_status'] = 'expired';
                return false;
            }
            return $user['subscription_status'] == 'active';
        }
    }
    return false;
}

function logout() {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit();
}

// Payment functions
function add_payment($user_id, $amount, $proof) {
    $payments = load_data('payments');
    $new_payment = [
        'id' => count($payments) + 1,
        'user_id' => $user_id,
        'amount' => $amount,
        'proof' => $proof,
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];
    $payments[] = $new_payment;
    save_data('payments', $payments);
    return $new_payment['id'];
}

function approve_payment($payment_id) {
    $payments = load_data('payments');
    $users = load_data('users');
    
    foreach ($payments as &$payment) {
        if ($payment['id'] == $payment_id && $payment['status'] == 'pending') {
            $payment['status'] = 'approved';
            
            // Update user subscription
            foreach ($users as &$user) {
                if ($user['id'] == $payment['user_id']) {
                    $user['subscription_status'] = 'active';
                    $user['subscription_expiry'] = date('Y-m-d', strtotime('+1 month'));
                    save_data('users', $users);
                    $_SESSION['subscription_status'] = 'active';
                    $_SESSION['subscription_expiry'] = $user['subscription_expiry'];
                }
            }
            
            save_data('payments', $payments);
            return true;
        }
    }
    return false;
}

function get_pending_payments() {
    $payments = load_data('payments');
    $users = load_data('users');
    $pending = [];
    
    foreach ($payments as $payment) {
        if ($payment['status'] == 'pending') {
            $user = array_filter($users, function($u) use ($payment) {
                return $u['id'] == $payment['user_id'];
            });
            $user = array_values($user)[0] ?? null;
            
            if ($user) {
                $payment['user_name'] = $user['name'];
                $payment['user_email'] = $user['email'];
                $pending[] = $payment;
            }
        }
    }
    
    usort($pending, function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });
    
    return $pending;
}

// Video upload function
function upload_video($course_id, $video_data, $title) {
    global $data_dir;
    
    $video_dir = $data_dir . '/videos';
    if (!file_exists($video_dir)) {
        mkdir($video_dir, 0777, true);
    }
    
    $filename = 'course_' . $course_id . '_' . time() . '.mp4';
    $filepath = $video_dir . '/' . $filename;
    
    file_put_contents($filepath, $video_data);
    
    $courses = load_data('courses');
    foreach ($courses as &$course) {
        if ($course['id'] == $course_id) {
            $course['video_url'] = $filename;
            $course['video_title'] = $title;
            save_data('courses', $courses);
            return true;
        }
    }
    return false;
}

// Page routing
$page = $_GET['page'] ?? 'home';
$action = $_GET['action'] ?? '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['login'])) {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if (login($email, $password)) {
            header('Location: ' . $_SERVER['PHP_SELF'] . '?page=dashboard');
            exit();
        } else {
            $error = 'Invalid email or password';
        }
    }
    
    if (isset($_POST['signup'])) {
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        if ($password !== $confirm_password) {
            $error = 'Passwords do not match';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters';
        } elseif (register_user($name, $email, $phone, $password)) {
            login($email, $password);
            header('Location: ' . $_SERVER['PHP_SELF'] . '?page=dashboard');
            exit();
        } else {
            $error = 'Email already exists or registration failed';
        }
    }
    
    if (isset($_POST['add_payment'])) {
        if (is_logged_in()) {
            $amount = 25000; // Fixed subscription price
            $proof = 'proof_' . time() . '.jpg'; // In real app, handle actual file upload
            $payment_id = add_payment($_SESSION['user_id'], $amount, $proof);
            $success = 'Payment proof submitted! Admin will verify within 24 hours.';
        } else {
            $error = 'You must be logged in to make payments';
        }
    }
    
    if (isset($_POST['approve_payment'])) {
        if (is_admin() && isset($_POST['payment_id'])) {
            if (approve_payment($_POST['payment_id'])) {
                $success = 'Payment approved successfully!';
            } else {
                $error = 'Failed to approve payment';
            }
        }
    }
    
    if (isset($_POST['upload_video'])) {
        if (is_admin() && isset($_POST['course_id']) && isset($_POST['video_title'])) {
            // In real app, handle actual file upload
            $dummy_video = 'dummy video content';
            if (upload_video($_POST['course_id'], $dummy_video, $_POST['video_title'])) {
                $success = 'Video uploaded successfully!';
            } else {
                $error = 'Failed to upload video';
            }
        }
    }
}

// Handle logout
if ($action === 'logout') {
    logout();
}

// Handle theme toggle
if (isset($_GET['toggle_theme'])) {
    $_SESSION['dark_mode'] = !isset($_SESSION['dark_mode']) || !$_SESSION['dark_mode'];
    header('Location: ' . $_SERVER['PHP_SELF'] . '?page=' . $page);
    exit();
}

// Get theme setting
$dark_mode = isset($_SESSION['dark_mode']) && $_SESSION['dark_mode'];
?>
<!DOCTYPE html>
<html lang="en" <?= $dark_mode ? 'class="dark"' : '' ?>>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NaijaCodeAcademy - Learn Web Development</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --primary: #1e40af; --secondary: #16a34a; --accent: #d97706; }
        body { font-family: 'Inter', sans-serif; transition: background-color 0.3s, color 0.3s; }
        .dark body { background-color: #0f172a; color: #f1f5f9; }
        .course-card { transition: all 0.3s ease; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .course-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 0.5rem; background: #000; }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .chat-bubble { max-width: 80%; padding: 10px 15px; border-radius: 18px; margin: 8px 0; }
        .chat-bubble.user { background-color: #1e40af; color: white; border-bottom-right-radius: 5px; float: right; }
        .chat-bubble.ai { background-color: #e2e8f0; color: #1e293b; border-bottom-left-radius: 5px; float: left; position: relative; }
        .dark .chat-bubble.ai { background-color: #334155; color: #f1f5f9; }
        .clear-fix { clear: both; }
        .whatsapp-button { position: fixed; bottom: 20px; right: 20px; z-index: 99; width: 60px; height: 60px; border-radius: 50%; background-color: #25d366; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease; }
        .whatsapp-button:hover { transform: scale(1.1); }
        .modal { display: none; position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center; padding: 20px; }
        .dark .modal { background-color: rgba(15, 23, 42, 0.8); }
        .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .status-pending { background-color: #fffbeb; color: #b45309; }
        .dark .status-pending { background-color: #431407; color: #fed7aa; }
        .status-approved { background-color: #dcfce7; color: #16a34a; }
        .dark .status-approved { background-color: #052e16; color: #34d747; }
        .status-rejected { background-color: #fee2e2; color: #dc2626; }
        .dark .status-rejected { background-color: #450a0a; color: #fca5a5; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <?php if ($page === 'home'): ?>
    <!-- Home Page -->
    <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                    <i class="fas fa-play text-white"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">NaijaCodeAcademy</h1>
            </div>
            <div class="flex items-center space-x-4">
                <a href="?page=signup" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">Sign Up</a>
                <a href="?page=login" class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition">Login</a>
                <a href="?toggle_theme" class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <i class="fas fa-<?= $dark_mode ? 'sun' : 'moon' ?> text-gray-800 dark:text-gray-200"></i>
                </a>
            </div>
        </div>
    </header>

    <section class="py-12 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl font-bold mb-4">Learn Web Development the Nigerian Way</h1>
            <p class="text-xl mb-8">Affordable, practical courses to build real websites. Pay in Naira, learn at your own pace.</p>
            
            <div class="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
                <div class="flex items-center justify-center mb-4">
                    <i class="fas fa-credit-card mr-3 text-2xl"></i>
                    <span class="text-2xl font-bold">Manual Payment Method</span>
                </div>
                <p class="text-center text-lg">
                    <span class="font-semibold">Account Number:</span> 8034848106<br>
                    <span class="font-semibold">Bank:</span> Moniepoint<br>
                    <span class="font-semibold">Account Name:</span> Aignwa Eugene Ekeoha
                </p>
                <p class="mt-3 text-center text-sm opacity-90">
                    After payment, upload proof and we'll verify & credit your wallet within 24 hours
                </p>
            </div>
        </div>
    </section>

    <section class="py-12 px-4 bg-gray-100 dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Available Courses</h2>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Learn at your own pace with our practical courses</p>
                <div class="mt-4 inline-block bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm">
                    Subscription: <span class="font-bold">₦25,000/month</span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                $courses = load_data('courses');
                foreach ($courses as $course):
                ?>
                <div class="course-card bg-white dark:bg-gray-800">
                    <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-gray-500 dark:text-gray-400"><?= htmlspecialchars($course['title']) ?></span>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-xl mb-2"><?= htmlspecialchars($course['title']) ?></h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4"><?= htmlspecialchars($course['description']) ?></p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₦<?= number_format($course['price']) ?></span>
                            <a href="?page=signup" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                                <i class="fas fa-user-plus mr-1"></i>
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <footer class="bg-gray-900 text-gray-400 py-12 px-4 mt-12">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <i class="fas fa-play text-white text-xl"></i>
                        <span class="text-xl font-bold text-white">NaijaCodeAcademy</span>
                    </div>
                    <p class="mb-4">
                        Empowering Nigerians with affordable web development skills.
                    </p>
                </div>
                <div>
                    <h3 class="text-white font-semibold mb-4">Support</h3>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-2"></i>
                            <span>WhatsApp: +234 907 600 4075</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-2"></i>
                            <span>support@naijacodeacademy.ng</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-semibold mb-4">Subscription</h3>
                    <ul class="space-y-1">
                        <li>₦25,000 monthly</li>
                        <li>Access to all courses</li>
                        <li>Download videos for offline viewing</li>
                        <li>Certificate of completion</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="?page=signup" class="hover:text-white transition">Sign Up</a></li>
                        <li><a href="?page=login" class="hover:text-white transition">Login</a></li>
                        <li><a href="#" class="hover:text-white transition">Courses</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                <p>© <?= date('Y') ?> NaijaCodeAcademy. All rights reserved.</p>
            </div>
        </div>
    </footer>
    
    <?php elseif ($page === 'login'): ?>
    <!-- Login Page -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="w-full max-w-md px-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div class="p-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div class="p-6">
                    <div class="text-center mb-8">
                        <div class="mx-auto bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                            <i class="fas fa-play text-white text-xl"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Login to NaijaCodeAcademy</h1>
                        <p class="text-gray-600 dark:text-gray-300 mt-2">Access your courses and learning dashboard</p>
                    </div>
                    
                    <?php if (isset($error)): ?>
                    <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                        <?= htmlspecialchars($error) ?>
                    </div>
                    <?php endif; ?>
                    
                    <form method="POST">
                        <div class="mb-4">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" for="email">
                                Email Address
                            </label>
                            <div class="relative">
                                <i class="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                                <input id="email" name="email" type="email" required class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="yourname@example.com">
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" for="password">
                                Password
                            </label>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                                <input id="password" name="password" type="password" required class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••">
                                <button type="button" onclick="togglePasswordVisibility('password')" class="absolute right-3 top-3 text-gray-400">
                                    <i class="fas fa-eye" id="password-icon"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" name="login" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition">
                            Login to Continue
                        </button>
                        
                        <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>Don't have an account? <a href="?page=signup" class="text-indigo-600 font-medium">Sign up here</a></p>
                            <p class="mt-2">Admin access: Use provided credentials</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <footer class="bg-gray-900 text-gray-400 py-6 px-4">
        <div class="max-w-6xl mx-auto text-center">
            <p>© <?= date('Y') ?> NaijaCodeAcademy. All rights reserved.</p>
        </div>
    </footer>
    
    <?php elseif ($page === 'signup'): ?>
    <!-- Signup Page -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="w-full max-w-md px-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div class="p-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div class="p-6">
                    <div class="text-center mb-8">
                        <div class="mx-auto bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                            <i class="fas fa-play text-white text-xl"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
                        <p class="text-gray-600 dark:text-gray-300 mt-2">Sign up to access all our courses</p>
                    </div>
                    
                    <?php if (isset($error)): ?>
                    <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                        <?= htmlspecialchars($error) ?>
                    </div>
                    <?php endif; ?>
                    
                    <form method="POST" onsubmit="return validateSignupForm()">
                        <div class="mb-2">
                            <input name="name" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Full Name">
                        </div>
                        <div class="mb-2">
                            <input name="email" type="email" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Email">
                        </div>
                        <div class="mb-2">
                            <input name="phone" type="tel" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Phone (0803...)">
                        </div>
                        <div class="mb-2">
                            <input name="password" type="password" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Password">
                        </div>
                        <div class="mb-4">
                            <input name="confirm_password" type="password" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Confirm Password">
                        </div>
                        
                        <button type="submit" name="signup" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition">
                            Create Account
                        </button>
                        
                        <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>Already have an account? <a href="?page=login" class="text-indigo-600 font-medium">Login here</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <footer class="bg-gray-900 text-gray-400 py-6 px-4">
        <div class="max-w-6xl mx-auto text-center">
            <p>© <?= date('Y') ?> NaijaCodeAcademy. All rights reserved.</p>
        </div>
    </footer>
    
    <?php elseif ($page === 'dashboard' && is_logged_in()): ?>
    <!-- User Dashboard -->
    <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                    <i class="fas fa-play text-white"></i>
                </div>
                <h1 class="text-xl font-bold">NaijaCodeAcademy</h1>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center bg-indigo-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    <i class="fas fa-wallet text-indigo-600 dark:text-indigo-400 mr-1"></i>
                    <span class="font-semibold">
                        <?= $_SESSION['subscription_status'] === 'active' ? 'Active Subscription' : 'No Active Subscription' ?>
                    </span>
                </div>
                <a href="?toggle_theme" class="p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <i class="fas fa-<?= $dark_mode ? 'sun' : 'moon' ?>"></i>
                </a>
                <a href="?action=logout" class="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </div>
        </div>
    </header>

    <section class="py-8 px-4">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-3xl font-bold mb-4">Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?></h1>
            <p class="text-lg mb-6">All courses included in your monthly subscription. Pay once, learn everything.</p>
            
            <?php if ($_SESSION['subscription_status'] !== 'active'): ?>
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 max-w-2xl mx-auto">
                <div class="flex items-center justify-center mb-3">
                    <i class="fas fa-crown mr-3"></i>
                    <span class="text-xl font-bold">Premium Subscription</span>
                </div>
                <p class="text-3xl font-bold">₦25,000</p>
                <p class="mt-2">Monthly access to all courses • New content added weekly</p>
                <p class="mt-2 text-sm opacity-90">
                    Upload payment proof to activate your subscription
                </p>
                <form method="POST" class="mt-4">
                    <button type="submit" name="add_payment" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition">
                        <i class="fas fa-upload mr-1"></i> Upload Payment Proof
                    </button>
                </form>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <?php if ($_SESSION['subscription_status'] === 'active'): ?>
    <section class="py-8 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">All Courses</h2>
                <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    Full Access Included
                </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php
                $courses = load_data('courses');
                foreach ($courses as $course):
                ?>
                <div class="course-card bg-white dark:bg-gray-800">
                    <div class="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-gray-500 dark:text-gray-400"><?= htmlspecialchars($course['title']) ?></span>
                    </div>
                    <div class="p-4">
                        <span class="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">Frontend</span>
                        <h3 class="font-bold text-lg mt-2"><?= htmlspecialchars($course['title']) ?></h3>
                        <p class="text-gray-600 dark:text-gray-300 mt-2"><?= htmlspecialchars($course['description']) ?></p>
                        <div class="mt-4">
                            <a href="<?= $course['video_url'] ?>" target="_blank" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center">
                                <i class="fas fa-play mr-1"></i> Start Learning
                            </a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <footer class="bg-gray-900 text-gray-400 py-8 px-4 mt-12">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <i class="fas fa-play text-white"></i>
                        <span class="text-xl font-bold text-white">NaijaCodeAcademy</span>
                    </div>
                    <p>Empowering Nigerians with affordable web development skills.</p>
                </div>
                <div>
                    <h3 class="text-white font-semibold mb-4">Support</h3>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-2"></i>
                            <span>WhatsApp: +234 907 600 4075</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-2"></i>
                            <span>support@naijacodeacademy.ng</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-semibold mb-4">Subscription</h3>
                    <ul class="space-y-1">
                        <li>₦25,000 monthly</li>
                        <li>Access to all courses</li>
                        <li>Download videos for offline viewing</li>
                        <li>Certificate of completion</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                <p>© <?= date('Y') ?> NaijaCodeAcademy. All rights reserved.</p>
                <p class="mt-2">Next billing date: <?= $_SESSION['subscription_expiry'] ?? 'N/A' ?></p>
            </div>
        </div>
    </footer>
    
    <?php elseif ($page === 'admin' && is_admin()): ?>
    <!-- Admin Dashboard -->
    <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <i class="fas fa-cog text-indigo-600 text-2xl"></i>
                <h1 class="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div class="flex items-center space-x-4">
                <a href="?toggle_theme" class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <i class="fas fa-<?= $dark_mode ? 'sun' : 'moon' ?>"></i>
                </a>
                <a href="?action=logout" class="bg-red-600 text-white px-4 py-2 rounded-lg">
                    Logout
                </a>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-6">
        <?php if (isset($success)): ?>
        <div class="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
            <?= htmlspecialchars($success) ?>
        </div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
        <div class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            <?= htmlspecialchars($error) ?>
        </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <i class="fas fa-users text-blue-500 mr-2"></i>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Total Users</p>
                        <?php
                        $users = load_data('users');
                        $total_users = count($users);
                        ?>
                        <p class="text-2xl font-bold"><?= $total_users ?></p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <i class="fas fa-hand-holding-usd text-green-500 mr-2"></i>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Pending Payments</p>
                        <?php
                        $pending_payments = get_pending_payments();
                        $total_pending = count($pending_payments);
                        ?>
                        <p class="text-2xl font-bold"><?= $total_pending ?></p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <i class="fas fa-video text-purple-500 mr-2"></i>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Total Courses</p>
                        <?php
                        $courses = load_data('courses');
                        $total_courses = count($courses);
                        ?>
                        <p class="text-2xl font-bold"><?= $total_courses ?></p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <i class="fas fa-wallet text-amber-500 mr-2"></i>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                        <p class="text-2xl font-bold">₦0</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-lg font-bold">Payment Approvals</h2>
                </div>
                <div class="p-4">
                    <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 class="font-bold mb-2">Manual Payment Instructions</h3>
                        <p>• Account: 8034848106</p>
                        <p>• Bank: Moniepoint</p>
                        <p>• Name: Aignwa Eugene Ekeoha</p>
                        <p class="mt-2 font-semibold">Amount: ₦25,000 per month</p>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <?php if (empty($pending_payments)): ?>
                                <tr>
                                    <td colspan="5" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">No pending payments</td>
                                </tr>
                                <?php else: ?>
                                <?php foreach ($pending_payments as $payment): ?>
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"><?= htmlspecialchars($payment['user_name']) ?></td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₦<?= number_format($payment['amount']) ?></td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><?= date('M j, Y', strtotime($payment['created_at'])) ?></td>
                                    <td class="px-4 py-4 whitespace-nowrap"><span class="status-badge status-pending">Pending</span></td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <form method="POST" class="flex space-x-2">
                                            <input type="hidden" name="payment_id" value="<?= $payment['id'] ?>">
                                            <button type="submit" name="approve_payment" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                <i class="fas fa-check-circle"></i>
                                            </button>
                                            <button type="button" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="rejectPayment(<?= $payment['id'] ?>)">
                                                <i class="fas fa-times-circle"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-lg font-bold">Course Management</h2>
                </div>
                <div class="p-4">
                    <div class="mb-4">
                        <label class="block mb-2">Select Course to Upload Video</label>
                        <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-700">
                            <option>Select a course</option>
                            <?php foreach ($courses as $course): ?>
                            <option value="<?= $course['id'] ?>"><?= htmlspecialchars($course['title']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-4">
                        <i class="fas fa-cloud-upload-alt text-3xl mb-3 text-indigo-600"></i>
                        <p class="mb-2">Drag and drop your video file here</p>
                        <p class="text-sm text-gray-500 mb-4">Or click to browse</p>
                        <div class="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg inline-block">
                            <i class="fas fa-folder-open mr-2"></i> Choose File
                        </div>
                    </div>
                    
                    <form method="POST">
                        <div class="mb-2">
                            <input name="course_id" type="hidden" value="1">
                            <input name="video_title" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Video Title">
                        </div>
                        <button type="submit" name="upload_video" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                            Upload Video
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <?php else: ?>
    <!-- Redirect to login if not authenticated -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="text-center">
            <div class="mx-auto bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-play text-white text-xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Login to Continue</h1>
            <a href="?page=login" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Go to Login Page
            </a>
        </div>
    </div>
    <?php endif; ?>

    <div id="whatsapp-button" class="whatsapp-button">
        <i class="fab fa-whatsapp text-white text-2xl"></i>
    </div>

    <script>
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById('password-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    function validateSignupForm() {
        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
        
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return false;
        }
        
        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            return false;
        }
        
        return true;
    }
    
    function rejectPayment(paymentId) {
        if (confirm('Are you sure you want to reject this payment?')) {
            // In a real implementation, this would call a PHP script via AJAX
            alert('Payment rejected successfully!');
        }
    }
    
    document.getElementById('whatsapp-button').addEventListener('click', function() {
        window.open('https://wa.me/2349076004075', '_blank');
    });
    </script>
</body>
</html>
