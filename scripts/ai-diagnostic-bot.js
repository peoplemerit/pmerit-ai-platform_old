/**
 * PMERIT AI-Powered Diagnostic Bot
 * Comprehensive educational platform analysis for underserved communities.
 * - Security, accessibility, authentication, educational impact
 * - Generates actionable reports for developers and educators
 */

const fs = require('fs');
const path = require('path');

let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new (require('openai')).OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (error) {
  console.log("OpenAI not available, running basic diagnostic mode");
}

class PMERITAIDiagnosticBot {
  constructor() {
    this.findings = [];
    this.projectContext = "Gabriel AI Educational Platform - Breaking poverty cycles through accessible education in Nigeria/Africa";
    this.criticalFiles = [
      'js/auth.js', 'js/components.js', 'js/dashboard.js', 'js/course-hub.js',
      'css/responsive.css', 'css/main.css', 'css/course-hub.css',
      'index.html', 'dashboard.html', 'courses.html'
    ];
    this.aiAnalysis = null;
  }

  async runComprehensiveScan() {
    console.log("🤖 PMERIT AI Bot: Starting educational platform analysis...");
    console.log(`📅 Scan initiated: ${new Date().toISOString()}`);

    try {
      await this.scanEducationalPlatform();
      if (openai) await this.getAIRecommendations();
      else console.log("ℹ️ Running in basic mode without AI analysis");

      await this.generateEducationalReports();
      await this.createActionPlan();

      console.log("✅ Educational platform analysis complete!");
      console.log(`📊 Total findings: ${this.findings.length}`);
    } catch (error) {
      console.error("❌ Analysis failed:", error.message);
      await this.generateErrorReport(error);
    }
  }

  async scanEducationalPlatform() {
    console.log("🔍 Scanning PMERIT critical files...");
    for (const file of this.criticalFiles) {
      if (fs.existsSync(file)) {
        await this.analyzeEducationalFile(file);
      }
    }
    this.checkStudentDataSecurity();
    this.checkMobileAccessibility();
    this.checkEducationalFeatures();
    this.checkProductionReadiness();
  }

  async analyzeEducationalFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      // Modular checks
      this.scanStudentDataSecurity(filePath, content);
      this.scanMobileAccessibility(filePath, content);
      this.scanEducationalAuthentication(filePath, content);
      this.scanCourseEnrollment(filePath, content);
    } catch (error) {
      this.addFinding({
        file: filePath,
        severity: "MEDIUM",
        category: "System",
        issue: `File analysis error: ${error.message}`,
        impact: "Cannot analyze critical educational platform file",
        recommendation: "Check file permissions and encoding"
      });
    }
  }

  scanStudentDataSecurity(filePath, content) {
    const patterns = [
      {
        pattern: /localStorage\.setItem.*session|localStorage\.setItem.*user/gi,
        severity: "CRITICAL",
        issue: "Student session data stored unencrypted",
        impact: "Student privacy at risk - sessions vulnerable to XSS attacks",
        recommendation: "Implement secure, encrypted session storage for student data protection"
      },
      {
        pattern: /password.*=.*value|password.*alert|password.*console/gi,
        severity: "CRITICAL",
        issue: "Student password exposure risk",
        impact: "Student credentials may be exposed or logged",
        recommendation: "Remove password content from logs and implement secure password handling"
      },
      {
        pattern: /innerHTML.*\+.*input|innerHTML.*=.*[^"']\w+/gi,
        severity: "HIGH",
        issue: "DOM injection vulnerability affecting students",
        impact: "Students could be exposed to malicious content or XSS attacks",
        recommendation: "Use textContent or sanitize all user input before DOM insertion"
      }
    ];
    this.applyPatterns(filePath, content, patterns, "Security");
  }

  scanMobileAccessibility(filePath, content) {
    const patterns = [
      {
        pattern: /min-height:\s*(?:[1-3]\d|[1-9])px/gi,
        severity: "HIGH",
        issue: "Touch targets too small for mobile students",
        impact: "Poor accessibility for students using low-cost Android devices",
        recommendation: "Ensure all buttons and links are at least 44px for mobile accessibility"
      },
      {
        pattern: /font-size:\s*([1-9]|1[01])px/gi,
        severity: "MEDIUM",
        issue: "Text too small for mobile learning",
        impact: "Difficult reading experience for students on mobile devices",
        recommendation: "Use minimum 12px font sizes, prefer rem units for scalability"
      },
      {
        pattern: /@media.*max-width.*768px.*{[^}]*display:\s*none/gi,
        severity: "MEDIUM",
        issue: "Educational content hidden on mobile",
        impact: "Students may miss critical learning features on mobile devices",
        recommendation: "Provide mobile-friendly alternatives instead of hiding content"
      }
    ];
    this.applyPatterns(filePath, content, patterns, "Mobile");
  }

  scanEducationalAuthentication(filePath, content) {
    const patterns = [
      {
        pattern: /addSubjectToCart.*{[^}]*(?!try|catch)/gi,
        severity: "MEDIUM",
        issue: "Course enrollment lacks error handling",
        impact: "Students may experience failed enrollments without clear feedback",
        recommendation: "Add comprehensive error handling with student-friendly messages"
      },
      {
        pattern: /window\.location\.href.*=.*signin/gi,
        severity: "LOW",
        issue: "Hard-coded authentication redirects",
        impact: "Reduces flexibility for educational platform deployment",
        recommendation: "Use configurable redirect URLs for authentication flow"
      }
    ];
    this.applyPatterns(filePath, content, patterns, "Authentication");
  }

  scanCourseEnrollment(filePath, content) {
    if (filePath.includes('course-hub') || filePath.includes('dashboard')) {
      this.addFinding({
        file: filePath,
        severity: "MEDIUM",
        category: "Educational",
        issue: "Course enrollment flow needs validation",
        impact: "Students may encounter issues during course enrollment process",
        recommendation: "Implement comprehensive course enrollment testing and user feedback"
      });
    }
  }

  checkStudentDataSecurity() {
    this.addFinding({
      file: "Student Data Protection",
      severity: "HIGH",
      category: "Security",
      issue: "Student data protection compliance needs verification",
      impact: "Platform may not meet privacy standards for educational data",
      recommendation: "Implement GDPR/FERPA compliance measures for student privacy protection"
    });
  }

  checkMobileAccessibility() {
    this.addFinding({
      file: "Mobile Accessibility",
      severity: "HIGH",
      category: "Mobile",
      issue: "Limited offline capability for low-bandwidth areas",
      impact: "Students in areas with poor connectivity cannot access educational content",
      recommendation: "Implement Progressive Web App features with offline learning capabilities"
    });
  }

  checkEducationalFeatures() {
    this.addFinding({
      file: "Educational Features",
      severity: "MEDIUM",
      category: "Educational",
      issue: "Student progress tracking needs enhancement",
      impact: "Students may lose track of their learning progress across sessions",
      recommendation: "Implement robust progress persistence and recovery mechanisms"
    });
  }

  checkProductionReadiness() {
    this.addFinding({
      file: "Production Deployment",
      severity: "MEDIUM",
      category: "Production",
      issue: "Educational platform production readiness assessment needed",
      impact: "Platform may face issues when deployed for student use at scale",
      recommendation: "Conduct thorough production readiness review for educational workloads"
    });
  }

  async getAIRecommendations() {
    if (!openai || this.findings.length === 0) return;
    try {
      const prompt = `As an expert AI consultant for PMERIT Educational Platform, analyze these findings:

**Mission:** ${this.projectContext}
**Target Users:** Students in underserved communities (Nigeria/Africa)
**Platform Type:** Accessible education through AI-powered learning

**Findings to Analyze:**
${JSON.stringify(this.findings.slice(0, 10), null, 2)}

**Required Analysis:**
1. **Educational Impact Priority:** Rank by impact on student learning outcomes
2. **Accessibility for Underserved Communities:** Mobile, bandwidth, device constraints  
3. **Student Data Protection:** Privacy and security for educational data
4. **Learning Experience Quality:** How issues affect educational engagement
5. **Implementation Roadmap:** Prioritized fixes with realistic timelines

Provide clear, actionable recommendations focused on educational mission success.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });
      this.aiAnalysis = response.choices[0].message.content;
      console.log("✅ AI educational analysis complete");
    } catch (error) {
      console.error("❌ AI analysis failed:", error.message);
      this.aiAnalysis = "AI analysis unavailable - proceeding with standard educational assessment";
    }
  }

  async generateEducationalReports() {
    console.log("📋 Generating educational platform reports...");
    ["diagnostic-reports", "security-reports", "mobile-reports", "educational-reports", "action-plans"].forEach(this.ensureDirectoryExists);
    await this.generateMainEducationalReport();
    await this.generateSummaryForGitHub();
  }

  async generateMainEducationalReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    const critical = this.findings.filter(f => f.severity === 'CRITICAL').length;
    const high = this.findings.filter(f => f.severity === 'HIGH').length;
    const report = `# 🎓 PMERIT Educational Platform - AI Diagnostic Report

**Generated:** ${new Date().toISOString()}  
**Platform:** Gabriel AI Educational Platform  
**Mission:** Breaking poverty cycles through accessible education  
**Target Communities:** Nigeria/Africa underserved populations  

## 🎯 Executive Summary

${this.generateEducationalExecutiveSummary()}

## 🧠 AI-Powered Educational Analysis

${this.aiAnalysis || 'Educational platform analysis based on best practices for underserved communities.'}

## 📊 Educational Platform Health Overview

- **Total Issues:** ${this.findings.length}
- **Critical Security Issues:** ${critical}
- **High Priority Accessibility:** ${high}
- **Student Impact Assessment:** ${this.findings.filter(f => f.category === 'Educational').length} items reviewed

## 🔍 Findings by Educational Priority

${this.generateEducationalPriorityFindings()}

## 🚀 Action Plan for Educational Excellence

${this.generateEducationalActionPlan()}

## 💬 Interactive AI Assistant

Get personalized help with educational platform development:

\`\`\`bash
# Student experience questions
./scripts/ask-ai-bot.sh "How to improve student registration flow?"
./scripts/ask-ai-bot.sh "Optimize platform for low-bandwidth areas"
# Security and privacy questions
./scripts/ask-ai-bot.sh "Protect student data according to GDPR"
./scripts/ask-ai-bot.sh "Secure authentication for shared devices"
# Mobile accessibility questions
./scripts/ask-ai-bot.sh "Mobile optimization for Nigerian students"
./scripts/ask-ai-bot.sh "Offline learning capabilities implementation"
\`\`\`

---
*Generated by PMERIT AI Bot 🤖 - Empowering education through intelligent development*
`;
    this.writeReport(`diagnostic-reports/${timestamp}-educational-platform-analysis.md`, report);
  }

  async generateSummaryForGitHub() {
    const critical = this.findings.filter(f => f.severity === 'CRITICAL').length;
    const high = this.findings.filter(f => f.severity === 'HIGH').length;
    const summary = `
## 📊 Educational Platform Status

- **Mission Focus:** ✅ Accessible education for underserved communities
- **Critical Issues:** ${critical} (requires immediate attention)
- **High Priority:** ${high} (affects student experience)
- **AI Analysis:** ${this.aiAnalysis ? '✅ Complete' : '⚠️ Basic mode'}

## 🎓 Key Educational Priorities

1. **Student Data Protection** - ${this.findings.filter(f => f.category === 'Security').length} security items
2. **Mobile Accessibility** - ${this.findings.filter(f => f.category === 'Mobile').length} mobile optimization items  
3. **Learning Experience** - ${this.findings.filter(f => f.category === 'Educational').length} educational feature items

## 🚀 Next Steps

${critical > 0 ? '- 🚨 Address critical security vulnerabilities immediately' : ''}
${high > 0 ? '- 📱 Optimize mobile accessibility for target communities' : ''}
- 🎯 Enhance student enrollment and progress tracking
`;
    this.writeReport('diagnostic-reports/latest-summary.md', summary);

    // Generate critical findings for GitHub issues
    const criticalFindings = this.findings.filter(f => f.severity === 'CRITICAL');
    if (criticalFindings.length > 0) {
      this.writeReport('diagnostic-reports/critical-findings.json', JSON.stringify(criticalFindings, null, 2));
    }
  }

  generateEducationalExecutiveSummary() {
    const critical = this.findings.filter(f => f.severity === 'CRITICAL').length;
    const high = this.findings.filter(f => f.severity === 'HIGH').length;
    let summary = "The PMERIT educational platform demonstrates strong alignment with its mission of breaking poverty cycles through accessible education. ";
    if (critical > 0)
      summary += `**${critical} critical security issues** require immediate attention to protect student data and privacy. `;
    if (high > 0)
      summary += `**${high} high-priority accessibility improvements** are needed to optimize the platform for students using mobile devices in underserved communities. `;
    summary += "The platform shows excellent potential for serving its target communities with proper security and accessibility enhancements.";
    return summary;
  }

  generateEducationalPriorityFindings() {
    const categories = ['Security', 'Mobile', 'Educational', 'Authentication'];
    let output = '';
    categories.forEach(category => {
      const findings = this.findings.filter(f => f.category === category);
      if (findings.length > 0) {
        output += `\n### ${category} - Priority (${findings.length} items)\n\n`;
        findings.slice(0, 3).forEach(f => {
          output += `**${f.severity}:** ${f.issue}\n📁 **File:** \`${f.file}\`\n🎯 **Student Impact:** ${f.impact}\n💡 **Recommendation:** ${f.recommendation}\n\n`;
        });
      }
    });
    return output;
  }

  generateEducationalActionPlan() {
    const immediate = this.findings.filter(f => f.severity === 'CRITICAL');
    const shortTerm = this.findings.filter(f => f.severity === 'HIGH');
    let plan = "### 🚨 Immediate Actions (This Week)\n";
    immediate.slice(0, 3).forEach(f => { plan += `- **${f.issue}** - ${f.recommendation}\n`; });
    plan += "\n### 📅 Short-term Goals (Next 2 Weeks)\n";
    shortTerm.slice(0, 3).forEach(f => { plan += `- **${f.issue}** - Focus on student experience improvement\n`; });
    plan += "\n### 🎓 Excellence Goals (Next Month)\n";
    plan += "- Implement offline learning capabilities for low-bandwidth areas\n- Enhance student progress tracking\n- Optimize for low-cost mobile devices\n";
    return plan;
  }

  // Utilities
  applyPatterns(filePath, content, patterns, category) {
    patterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        this.addFinding({
          file: filePath,
          line: this.getLineNumber(content, matches[0]),
          severity: pattern.severity,
          category,
          issue: pattern.issue,
          impact: pattern.impact,
          recommendation: pattern.recommendation,
          codeSnippet: matches[0].substring(0, 100)
        });
      }
    });
  }

  addFinding(finding) {
    this.findings.push({
      ...finding,
      timestamp: new Date().toISOString(),
      id: this.generateFindingId()
    });
  }

  generateFindingId() {
    return 'PMERIT-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  }

  getLineNumber(content, match) {
    const index = content.indexOf(match);
    return index === -1 ? 1 : content.substring(0, index).split('\n').length;
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  writeReport(filePath, content) {
    try {
      fs.writeFileSync(filePath, content);
      console.log(`📋 Report generated: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to write report ${filePath}:`, error.message);
    }
  }

  async generateErrorReport(error) {
    const errorReport = `# ❌ PMERIT AI Bot Error Report

**Timestamp:** ${new Date().toISOString()}  
**Educational Platform:** Gabriel AI - PMERIT  
**Error:** ${error.message}  

## 🔧 Recovery Actions

1. Verify OpenAI API Configuration
2. Check critical files and permissions
3. Confirm Node.js and dependencies are installed
4. Contact: support@pmerit.com

Platform remains operational while improvements are implemented.
`;
    this.ensureDirectoryExists('error-reports');
    this.writeReport('error-reports/ai-bot-error.md', errorReport);
  }

  async createActionPlan() {
    console.log("🎯 Creating action plan...");
    // Future: implement action plan generation, e.g., roadmap for new features
  }
}

// Execute
(async () => {
  console.log("🎓 Initializing PMERIT Educational Platform AI Analysis...");
  const bot = new PMERITAIDiagnosticBot();
  await bot.runComprehensiveScan();
  console.log("🎓 Analysis complete - Ready to serve students!");
})().catch(error => {
  console.error('❌ PMERIT AI Bot failed:', error);
  process.exit(1);
});
