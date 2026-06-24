export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative z-10 animate-dramatic">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8">
        Privacy Policy
      </h1>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-pink-200 dark:border-gray-700 shadow-lg space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        <p>
          Kernel Compass ("we", "our", or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your information
          when you visit our website.
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">1. Information We Collect</h2>
        <p>
          When you register, we collect your name, email address, and any optional profile details
          (bio, birthday, profile picture). We also store content you create (posts, comments)
          and interactions (likes, bookmarks, follows).
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and improve our services</li>
          <li>To send notifications related to your account and community interactions</li>
          <li>To display your public profile and content as you choose</li>
          <li>To ensure the safety and security of our platform</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">3. Data Sharing</h2>
        <p>
          We do not sell your personal data. Your email is never shown publicly.
          Content marked "Public" is visible to all visitors; content marked "Followers only" is
          visible only to users who follow you. You can manage this setting for each post.
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">4. Your Rights</h2>
        <p>
          You can edit or delete your profile and posts at any time. To request account deletion
          or data export, contact us at <strong>support@kernelcompass.com</strong>.
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">5. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, please reach out via our
          Contact page or email us at support@kernelcompass.com.
        </p>
      </div>
    </div>
  );
}