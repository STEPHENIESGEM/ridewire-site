<?php
/**
 * RideWire Animated Demo Section
 * 
 * This file contains the animated demo that was injected into the WordPress theme's functions.php
 * The animation displays a live diagnostic workflow without requiring an external video file.
 * 
 * DEPLOYMENT:
 * Add the following code to wp-content/themes/[theme]/functions.php at the end of the file:
 * 
 * add_action( 'wp_footer', 'ridewire_add_animated_demo' );
 * 
 * ANIMATION FEATURES:
 * - Types out vehicle problem input: "Check engine light P0300 - 2015 Honda Accord"
 * - Shows 3 AI panels analyzing the problem (ChatGPT, Claude, Gemini)
 * - Displays confidence scores for each AI
 * - Shows RideWire consensus result with 94% confidence
 * - Auto-loops every 12 seconds
 * - Fully responsive, works on mobile and desktop
 * - No external video files required
 * - CTA button links to /pricing
 */

function ridewire_add_animated_demo() {
    // Check if we're on the homepage to avoid loading on every page
    if ( is_home() || is_front_page() ) {
        ?>
        <section id="ridewire-animated-demo" style="background:#0A1128; padding:60px 20px; text-align:center; margin-top:40px;">
            <div style="max-width:1200px; margin:0 auto;">
                <h2 style="color:#00D9FF; font-size:32px; font-weight:bold; margin-bottom:20px;">Watch RideWire Diagnose a Real Problem in 30 Seconds</h2>
                <p style="color:#FFFFFF; font-size:18px; margin-bottom:40px; line-height:1.6;">See how multiple AI experts agree on the fastest, lowest-risk fix for a real check-engine-light issue.</p>
                
                <div style="position:relative; max-width:900px; margin:0 auto; border-radius:10px; overflow:hidden; box-shadow:0 8px 30px rgba(0,217,255,0.3); background:#1A1D2E; padding:40px; min-height:350px;">
                    <div style="text-align:left; margin-bottom:30px;">
                        <label style="color:#00D9FF; font-weight:bold; font-size:14px;">Enter Vehicle Problem:</label>
                        <div style="margin-top:10px; font-size:16px; color:#FFFFFF; font-family:monospace; min-height:30px;" id="ridewire-input-display"></div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin:30px 0;">
                        <div style="background:#0A1128; padding:20px; border-radius:8px; border:1px solid #00D9FF;">
                            <div style="color:#00D9FF; font-weight:bold; margin-bottom:10px;">🤖 ChatGPT</div>
                            <div id="ridewire-chatgpt" style="color:#FFFFFF; font-size:12px; line-height:1.5; min-height:60px;" ></div>
                            <div style="margin-top:10px; color:#FFB800; font-size:11px;">Confidence: <span id="ridewire-chatgpt-conf">0%</span></div>
                        </div>
                        
                        <div style="background:#0A1128; padding:20px; border-radius:8px; border:1px solid #00D9FF;">
                            <div style="color:#00D9FF; font-weight:bold; margin-bottom:10px;">🤖 Claude</div>
                            <div id="ridewire-claude" style="color:#FFFFFF; font-size:12px; line-height:1.5; min-height:60px;"></div>
                            <div style="margin-top:10px; color:#FFB800; font-size:11px;">Confidence: <span id="ridewire-claude-conf">0%</span></div>
                        </div>
                        
                        <div style="background:#0A1128; padding:20px; border-radius:8px; border:1px solid #00D9FF;">
                            <div style="color:#00D9FF; font-weight:bold; margin-bottom:10px;">🤖 Gemini</div>
                            <div id="ridewire-gemini" style="color:#FFFFFF; font-size:12px; line-height:1.5; min-height:60px;"></div>
                            <div style="margin-top:10px; color:#FFB800; font-size:11px;">Confidence: <span id="ridewire-gemini-conf">0%</span></div>
                        </div>
                    </div>
                    
                    <div style="background:#28a745; padding:20px; border-radius:8px; margin-top:20px;">
                        <div style="color:#FFFFFF; font-weight:bold; margin-bottom:10px;">✅ RideWire Consensus Result (94% Confidence)</div>
                        <div id="ridewire-consensus" style="color:#FFFFFF; font-size:14px; line-height:1.6;"></div>
                    </div>
                </div>
                
                <div style="margin-top:40px;">
                    <a href="/pricing" style="display:inline-block; padding:18px 40px; background:#FFB800; color:#0A1128; text-decoration:none; border-radius:5px; font-weight:bold; font-size:20px; transition:all 0.3s;" onmouseover="this.style.background='#FFA500'" onmouseout="this.style.background='#FFB800'">
                        Start Free Trial
                    </a>
                </div>
            </div>
        </section>
        
        <script>
        (function() {
            const messages = [
                { el: 'ridewire-chatgpt', text: 'Random misfire. Check spark plugs first (85% likely). Verify coils if needed.', conf: 85 },
                { el: 'ridewire-claude', text: 'Ignition system issue. Spark plugs most probable. Test fuel injector spray pattern.', conf: 78 },
                { el: 'ridewire-gemini', text: 'Run compression test. Pattern suggests fuel injector or coil issue (72% probable).', conf: 72 }
            ];
            
            const inputText = 'Check engine light P0300 - 2015 Honda Accord';
            const consensusText = 'Start with spark plug replacement ($80-$150). If issue persists, test ignition coils. Estimated repair time: 30-45 minutes. Next steps: 1) Replace spark plugs, 2) If unresolved, check ignition coil resistance, 3) Consider fuel injector service if symptoms continue.';
            
            let charIndex = 0;
            let messageIndex = 0;
            
            function typeInput() {
                if (charIndex < inputText.length) {
                    document.getElementById('ridewire-input-display').textContent += inputText[charIndex];
                    charIndex++;
                    setTimeout(typeInput, 30);
                } else {
                    setTimeout(showMessages, 500);
                }
            }
            
            function showMessages() {
                if (messageIndex < messages.length) {
                    const msg = messages[messageIndex];
                    document.getElementById(msg.el).textContent = msg.text;
                    document.getElementById(msg.el + '-conf').textContent = msg.conf + '%';
                    messageIndex++;
                    setTimeout(showMessages, 400);
                } else {
                    setTimeout(showConsensus, 500);
                }
            }
            
            function showConsensus() {
                document.getElementById('ridewire-consensus').textContent = consensusText;
                setTimeout(reset, 6000);
            }
            
            function reset() {
                document.getElementById('ridewire-input-display').textContent = '';
                messages.forEach(msg => {
                    document.getElementById(msg.el).textContent = '';
                    document.getElementById(msg.el + '-conf').textContent = '0%';
                });
                document.getElementById('ridewire-consensus').textContent = '';
                charIndex = 0;
                messageIndex = 0;
                setTimeout(typeInput, 500);
            }
            
            typeInput();
        })();
        </script>
        <?php
    }
}
